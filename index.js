const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
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

const codeblockInjectionId = 'formatCodeblocks';

module.exports = class FormatCodeblocks extends Plugin {
  async startPlugin() {
    powercord.api.settings.registerSettings('format-codeblocks', {
      category: this.entityID,
      label: 'Format Codeblocks',
      render: Settings,
    });

    const parser = await getModule(['parse', 'parseTopic']);
    inject(
      codeblockInjectionId,
      parser.defaultRules.codeBlock,
      'react',
      args => {
        if (args[0].lang && this.settings.get('autoFormat', true))
          args[0].content = this.format(args[0]);
        return args;
      },
      true
    );
    this._forceUpdate();
  }

  pluginWillUnload() {
    powercord.api.settings.unregisterSettings('format-codeblocks');
    uninject(codeblockInjectionId);
    this._forceUpdate();
  }

  format(codeblock) {
    console.log(`Formatting ${codeblock.lang}...`);

    try {
      if (codeblock.lang === 'json') {
        return JSON.stringify(JSON.parse(codeblock.content), null, 2);
      }

      const parser = this.getParser(codeblock.lang);
      return prettier
        .format(codeblock.content, { parser, plugins })
        .replace(/\n+$/, '');
    } catch (error) {
      console.warn(error);
      return codeblock.content;
    }
  }

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
      .forEach(e => getReactInstance(e).memoizedProps.onMouseMove());
  }
};
