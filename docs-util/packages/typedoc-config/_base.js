/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")

const pathPrefix = path.join(__dirname, "..", "..", "..")

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  // extends: [typedocConfig],
  plugin: ["typedoc-plugin-markdown-medusa"],
  readme: "none",
  eslintPathName: path.join(
    pathPrefix,
    "www/packages/eslint-config-docs/content.js"
  ),
  pluginsResolvePath: path.join(pathPrefix, "www"),
  // Uncomment this when debugging
  // showConfig: true,
}
