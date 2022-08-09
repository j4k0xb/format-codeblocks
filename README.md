# Format Codeblocks

## Features

Automatically formats discord codeblocks using prettier (only visually, doesn't edit when sending).

### Before

![before](https://user-images.githubusercontent.com/55899582/162087746-1fd8b8bd-3bc9-4650-bf44-ebb79bf82c72.png)

### After

![after](https://user-images.githubusercontent.com/55899582/162087605-9de603a4-72c3-4f2c-ac30-2f5f64308597.png)

## Installation

Go to the Plugins folder and clone the repo:

```sh
git clone https://github.com/j4k0xb/format-codeblocks.git
```

## Supported languages

- js
- javascript
- json
- ts
- typescript
- hbs
- glimmer
- html.hbs
- html.handlebars
- htmlbars
- xml
- html
- xhtml
- rss
- atom
- xjb
- xsd
- xsl
- plist
- svg
- markdown
- css
- scss
- yml
- yaml

## Configuration

Go to the settings and edit the config according to https://prettier.io/docs/en/options.html

![prettier config](https://user-images.githubusercontent.com/55899582/162094846-31a0b9c0-2577-4417-9d09-9c2f7caba91d.png)

## Prettier

Source of [parsers](./prettier): https://unpkg.com/prettier@2.6.2/

## Planned features

- context menu (toggle between format/raw)
- select language of regular codeblock (list, sort by recently used, search?)
- prettier settings UI validation/feedback, hljs json

## Compatibility

- [x] https://github.com/Vap0r1ze/vpc-shiki
- [x] https://github.com/VenPlugs/Unindent
- [x] https://github.com/powercord-org/powercord/blob/v2/src/Powercord/plugins/pc-codeblocks/index.js
