const { React, getModuleByDisplayName } = require('powercord/webpack');
const { SwitchItem, TextAreaInput } = require('powercord/components/settings');
const AsyncComponent = require('powercord/components/AsyncComponent');

const Anchor = AsyncComponent.from(getModuleByDisplayName('Anchor'));

const PREITTER_CONFIG_DOCS = 'https://prettier.io/docs/en/options.html';

module.exports = ({ getSetting, updateSetting, toggleSetting }) => {
  return (
    <div>
      <SwitchItem
        value={getSetting('autoFormat', true)}
        onChange={() => toggleSetting('autoFormat')}
      >
        Automatically format code blocks from all users
      </SwitchItem>
      <SwitchItem
        value={getSetting('formatOnSend', true)}
        onChange={() => toggleSetting('formatOnSend')}
      >
        Automatically format code blocks before sending
      </SwitchItem>
      <TextAreaInput
        note={<>See <Anchor href={PREITTER_CONFIG_DOCS}>{PREITTER_CONFIG_DOCS}</Anchor></>}
        value={getSetting('prettierConfig', '{\n\n}')}
        onChange={val => updateSetting('prettierConfig', val)}
      >
        Prettier config (JSON format)
      </TextAreaInput>
    </div>
  );
};
