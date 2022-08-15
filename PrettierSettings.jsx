const { React } = require('powercord/webpack');
const {
  SwitchItem,
  TextInput,
  RadioGroup,
} = require('powercord/components/settings');
const prettier = require('./prettier/standalone');

function DynamicOption({ option, getSetting, updateSetting, toggleSetting }) {
  const settingId = `prettier-${option.name}`;
  const value = getSetting(settingId, option.default);

  switch (option.type) {
    case 'boolean':
      return (
        <SwitchItem
          value={value}
          onChange={() => toggleSetting(settingId)}
          note={`name: ${option.name}, default: ${option.default}`}
        >
          {option.description}
        </SwitchItem>
      );
    case 'int':
      return (
        <TextInput
          defaultValue={value}
          onChange={value => updateSetting(settingId, parseInt(value))}
          placeholder={`${option.range.start}...${option.range.end}`}
          note={`name: ${option.name}, default: ${option.default}`}
        >
          {option.description}
        </TextInput>
      );
    case 'choice':
      return (
        <RadioGroup
          value={value}
          onChange={({ value }) => updateSetting(settingId, value)}
          options={option.choices.map(choice => ({
            ...choice,
            desc: `${choice.description}${
              choice.value === option.default ? ' (default)' : ''
            }`,
            color: choice.value === option.default && 'var(--brand-experiment)',
          }))}
        >
          {option.description}
        </RadioGroup>
      );
  }
}

const optionNames = [
  'tabWidth',
  'semi',
  'singleQuote',
  'quoteProps',
  'jsxSingleQuote',
  'trailingComma',
  'bracketSpacing',
  'bracketSameLine',
  'arrowParens',
  'proseWrap',
  'htmlWhitespaceSensitivity',
  'vueIndentScriptAndStyle',
  'embeddedLanguageFormatting',
  'singleAttributePerLine',
];

module.exports = props => {
  const { options } = prettier.getSupportInfo();
  return optionNames.map(name => {
    const option = options.find(option => option.name == name);
    return DynamicOption({ ...props, option });
  });
};
