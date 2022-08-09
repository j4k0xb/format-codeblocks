const { React } = require('powercord/webpack');
const { SwitchItem, TextAreaInput } = require('powercord/components/settings');

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
        note="See https://prettier.io/docs/en/options.html"
        value={getSetting('prettierConfig', '{\n\n}')}
        onChange={val => updateSetting('prettierConfig', val)}
      >
        Prettier config (JSON format)
      </TextAreaInput>
    </div>
  );
};
