import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Core Concepts',
      items: ['core-concepts/openapi-extensions', 'core-concepts/parser', 'core-concepts/usage'],
    },
    {
      type: 'category',
      label: 'Extensions',
      items: ['extensions/route-aliases', 'extensions/custom-tags', 'extensions/permission-flags'],
    },
  ],
};

export default sidebars;
