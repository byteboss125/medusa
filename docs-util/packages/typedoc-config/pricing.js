/* eslint-disable @typescript-eslint/no-var-requires */
const modulesConfig = require("./modules")

module.exports = modulesConfig({
  entryPointPath: "packages/types/src/pricing/service.ts",
  outPath: "www/apps/docs/content/references/pricing",
  moduleName: "Pricing Module Reference",
  documentsToFormat: [
    {
      pattern: "IPricingModuleService.md",
      additionalFormatting: {
        reflectionDescription:
          "This section of the documentation provides a reference to the `IPricingModuleService` interface’s methods. This is the interface developers use to use the functionalities provided by the Pricing Module.",
        frontmatterData: {
          displayed_sidebar: "pricingReference",
          badge: {
            variant: "orange",
            text: "Beta",
          },
          slug: "/references/pricing",
        },
      },
    },
    {
      pattern: "IPricingModuleService/methods",
      additionalFormatting: {
        reflectionDescription:
          "This documentation provides a reference to the `{{alias}}` {{kind}}. This belongs to the Pricing Module.",
        frontmatterData: {
          displayed_sidebar: "pricingReference",
          badge: {
            variant: "orange",
            text: "Beta",
          },
          slug: "/references/pricing/{{alias}}",
          sidebar_label: "{{alias}}",
        },
        reflectionTitle: {
          kind: false,
          typeParameters: false,
          suffix: "- Pricing Module Reference",
        },
      },
    },
    {
      pattern: "*",
      useDefaults: true,
      additionalFormatting: {
        frontmatterData: {
          displayed_sidebar: "pricingReference",
        },
      },
    },
  ],
  extraOptions: {
    // frontmatterData: {
    //   displayed_sidebar: "modules",
    //   badge: {
    //     variant: "orange",
    //     text: "Beta",
    //   },
    //   // hide_table_of_contents: true,
    // },
  },
})
