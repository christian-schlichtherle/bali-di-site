module.exports = {
  description: 'The online documentation for Bali DI, a modern dependency injection tool for Java and Scala.',
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  lastUpdated: true,
  markdown: {
    extendMarkdown: md => ['abbr', 'deflist'].forEach(plugin => md.use(require('markdown-it-' + plugin)))
  },
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ],
  themeConfig: {
    docsBranch: 'main',
    docsDir: 'docs',
    docsRepo: 'christian-schlichtherle/bali-di-site',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub!',
    lastUpdated: 'Last Updated',
    nav: [
      {
        link: '/guide/java.md',
        text: 'Guide',
      },
      {
        link: 'https://github.com/christian-schlichtherle/bali-di-java',
        text: 'Java Repo'
      },
      {
        link: 'https://github.com/christian-schlichtherle/bali-di-scala',
        text: 'Scala Repo'
      }
    ],
    sidebar: {
      '/guide/': [
        'overview.md',
        'java.md',
        'scala.md',
      ]
    }
  },
  title: 'Bali DI'
}
