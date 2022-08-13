const { Plugin } = require('powercord/entities');
const { messages, getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { getReactInstance } = require('powercord/util');

const prettier = require('./prettier/standalone');
const plugins = [
  require('./prettier/parser-babel'),
  require('./prettier/parser-glimmer'),
  require('./prettier/parser-html'),
  require('./prettier/parser-markdown'),
  require('./prettier/parser-postcss'),
  require('./prettier/parser-typescript'),
  require('./prettier/parser-yaml'),
];

const Settings = require('./Settings');

const codeblockInjectionId = 'format-codeblocks-parse';
const sendMessageInjectionId = 'format-codeblocks-send-message';

module.exports = class FormatCodeblocks extends Plugin {
  async startPlugin() {
    powercord.api.settings.registerSettings(this.entityID, {
      category: this.entityID,
      label: 'Format Codeblocks',
      render: Settings,
    });

    await this.patchCodeblocks();
    this.patchSendMessage();
    this._forceUpdate();
  }

  pluginWillUnload() {
    powercord.api.settings.unregisterSettings(this.entityID);
    uninject(codeblockInjectionId);
    uninject(sendMessageInjectionId);
    this._forceUpdate();
  }

  patchSendMessage() {
    inject(
      sendMessageInjectionId,
      messages,
      'sendMessage',
      args => {
        /**
         * @type {{content: string}}
         */
        const msg = args[1];
        if (this.settings.get('formatOnSend', true)) {
          msg.content = msg.content.replace(/```(.+?)\n(.+?)```/gs, (_, lang, code) => {
            return `\`\`\`${lang}\n${this.format(code, lang)}\n\`\`\``;
          });
        }
        return args;
      },
      true
    );
  }

  async patchCodeblocks() {
    const parser = await getModule(['parse', 'parseTopic']);
    inject(
      codeblockInjectionId,
      parser.defaultRules.codeBlock,
      'react',
      args => {
        if (args[0].lang && this.settings.get('autoFormat', true))
          args[0].content = this.format(args[0].content, args[0].lang);
        return args;
      },
      true
    );
  }

  pluginWillUnload() {
    powercord.api.settings.unregisterSettings('format-codeblocks');
    uninject(codeblockInjectionId);
    this._forceUpdate();
  }

  /**
   * @param {string} code 
   * @param {string} lang 
   * @returns {string} formatted code
   */
  format(code, lang) {
    this.debug(`Formatting ${lang}...`);

    try {
      if (lang === 'json') {
        return JSON.stringify(JSON.parse(code), null, 2);
      }

      const config = JSON.parse(this.settings.get('prettierConfig', '{}'));
      const parser = this.getParser(lang);
      return prettier
        .format(code, { ...config, parser, plugins })
        .trim();
    } catch (error) {
      this.warn(error);
      return code;
    }
  }

  /**
   * @param {string} lang 
   * @returns {string}
   */
  getParser(lang) {
    switch (lang) {
      case 'js':
      case 'javascript':
      case 'json':
        return 'babel';
      case 'ts':
      case 'typescript':
        return 'typescript';
      case 'hbs':
      case 'glimmer':
      case 'html.hbs':
      case 'html.handlebars':
      case 'htmlbars':
        return 'glimmer';
      case 'xml':
      case 'html':
      case 'xhtml':
      case 'rss':
      case 'atom':
      case 'xjb':
      case 'xsd':
      case 'xsl':
      case 'plist':
      case 'svg':
        return 'html';
      case 'markdown':
        return 'markdown';
      case 'css':
      case 'scss':
        return 'postcss';
      case 'yml':
      case 'yaml':
        return 'yaml';
      default:
        return 'babel';
    }
  }

  _forceUpdate() {
    document
      .querySelectorAll('[id^="chat-messages-"] > div')
      .forEach(e => getReactInstance(e).memoizedProps.onMouseMove?.());
  }
};
