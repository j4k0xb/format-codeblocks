const { React, getModuleByDisplayName } = require('powercord/webpack');
const { Category, SwitchItem } = require('powercord/components/settings');
const AsyncComponent = require('powercord/components/AsyncComponent');
const PrettierSettings = require('./PrettierSettings');

const Anchor = AsyncComponent.from(getModuleByDisplayName('Anchor'));

const PRETTIER_CONFIG_DOCS = 'https://prettier.io/docs/en/options.html';

module.exports = props => {
  const { getSetting, updateSetting, toggleSetting } = props;
  const [prettierOpened, setPrettierOpened] = React.useState(true);

  return (
    <div>
      <SwitchItem
        value={getSetting('autoFormat', true)}
        onChange={() => toggleSetting('autoFormat')}
      >
        Format codeblocks from all users
      </SwitchItem>
      <SwitchItem
        value={getSetting('formatOnSend', true)}
        onChange={() => toggleSetting('formatOnSend')}
      >
        Format codeblocks before sending
      </SwitchItem>

      <Category
        name="Prettier settings"
        description={
          <>
            See{' '}
            <Anchor
              href={PRETTIER_CONFIG_DOCS}
              onClick={e => e.stopPropagation()}
            >
              {PRETTIER_CONFIG_DOCS}
            </Anchor>{' '}
            for a more detailed explanation
          </>
        }
        opened={prettierOpened}
        onChange={() => setPrettierOpened(!prettierOpened)}
      >
        <PrettierSettings {...props} />
      </Category>
    </div>
  );
};
