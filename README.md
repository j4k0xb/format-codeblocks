# Format Codeblocks

Automatically formats discord codeblocks using prettier

![before_after](https://user-images.githubusercontent.com/55899582/184512146-67279339-fa6b-490e-be4d-c713a16cff6e.png)

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
- [x] https://github.com/replugged-org/better-codeblocks
