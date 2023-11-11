// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const math = require("remark-math");
const katex = require("rehype-katex");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "FTC Docs",
  tagline: "Authors: Our comminity",
  favicon: "img/favicon.png",

  // Set the production url of your site here
  url: "https://ftcdocs.vercel.app/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Our community", // Usually your GitHub org/user name.
  projectName: "FTC Docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "vi",
    locales: ["vi"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true,
        },
      },
      image: "#",
      navbar: {
        title: "Khanhthanhdev",
        logo: {
          alt: "",
          src: "img/favicon.png",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "EN Version",
          },
          { to: '/vi-docs', label: 'VN version', position: 'left',},
          {
            href: "https://github.com/khanhthanhdev/DocsTest",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Team Vietnam - FIRST Global',
            items: [
              {
                label: 'Facebook',
                href: 'https://www.facebook.com/TeamVietnamFGC ',
              },
              {
                label: 'Website',
                href: 'https://firstglobalteamvietnam.weebly.com/',
              },
              {
                label: 'Contact us',
                href: 'https://firstglobalteamvietnam.weebly.com/contact.html',
              },
            ],
          },
          {
            title: 'Vietnam STEAM Union',
            items: [
              {
                label: 'Facebook',
                href: 'https://www.facebook.com/VietNamSTEAMUnion',
              },
              {
                label: 'Website',
                href: 'https://vsteam.edu.vn/',
              },
              {
                label: 'Our Community',
                href: 'https://firstglobalteamvietnam.weebly.com/vietnam-steam-union.html',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Our organization`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["java"],
      },
    }),
};

module.exports = config;
