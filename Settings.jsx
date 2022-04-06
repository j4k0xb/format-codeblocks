const { React } = require('powercord/webpack');
const { SwitchItem } = require('powercord/components/settings');

module.exports = ({ getSetting, toggleSetting }) => {
  return (
    <div>
      <SwitchItem
        value={getSetting('autoFormat', true)}
        onChange={() => toggleSetting('autoFormat')}
      >
        Automatically format code blocks
      </SwitchItem>
    </div>
  );
};
