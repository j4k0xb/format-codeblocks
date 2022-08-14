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
const MAX_CACHE_SIZE = 25;

module.exports = class FormatCodeblocks extends Plugin {
  /**
   * @type {Map<string, { lang: string, formatted: string }>}
   */
  codeCache = new Map();

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
        const [{ lang, content }] = args;

        const cached = this.codeCache.get(content);
        if (cached && cached.lang === lang) {
          args[0].content = cached.formatted;
          return args;
        }

        if (lang && this.settings.get('autoFormat', true)) {
          args[0].content = this.format(content, lang);
          this.updateCache(content, args[0].content, lang);
        }

        return args;
      },
      true
    );
  }

  /**
   * @param {string} code
   * @param {string} formatted
   * @param {string} lang
   */
  updateCache(code, formatted, lang) {
    this.codeCache.set(code, { lang, formatted });
    if (this.codeCache.size > MAX_CACHE_SIZE) {
      this.codeCache.delete(this.codeCache.keys().next().value);
    }
  }

  /**
   * @param {string} code 
   * @param {string} lang 
   * @returns {string} formatted code
   */
  format(code, lang) {
    try {
      if (lang === 'json') {
        return JSON.stringify(JSON.parse(code), null, 2);
      }

      const config = JSON.parse(this.settings.get('prettierConfig', '{}'));
      const parser = this.getParser(lang);
      if (!parser) return code;

      return prettier
        .format(code, { ...config, parser, plugins })
        .trim();
    } catch (error) {
      return code;
    }
  }

  /**
   * @param {string} lang 
   * @returns {string|undefined}
   */
  getParser(lang) {
    switch (lang) {
      case 'js':
      case 'javascript':
      case 'jsx':
      case 'json':
      case 'tsx':
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
      case 'md':
        return 'markdown';
      case 'css':
      case 'scss':
        return 'postcss';
      case 'yml':
      case 'yaml':
        return 'yaml';
    }
  }

  _forceUpdate() {
    this.codeCache.clear();
    document
      .querySelectorAll('[id^="chat-messages-"] > div')
      .forEach(e => getReactInstance(e).memoizedProps.onMouseMove?.());
  }
};
