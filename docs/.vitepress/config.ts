import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    description: 'A tool for dependency injection in Java and Scala at compile-time.',
/*
    head: [
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ],
*/
    lastUpdated: true,
    themeConfig: {
        editLink: {
            pattern: 'https://github.com/christian-schlichtherle/bali-di-site/:path',
            text: 'Edit this page on GitHub',
        },
        footer: {
            message: 'Released under the Apache License, Version 2.0.',
            copyright: 'Copyright © Schlichtherle IT Services.',
        },
        logo: { src: '/image/frangipani.png', width: 102, height: 64 },
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {
                link: '/guide/java',
                text: 'Bali DI for Java',
            },
            {
                link: '/guide/scala',
                text: 'Bali DI for Scala',
            },
            {
                link: 'https://github.com/christian-schlichtherle/bali-di-java',
                text: 'Java Repo'
            },
            {
                link: 'https://github.com/christian-schlichtherle/bali-di-scala',
                text: 'Scala Repo'
            },
        ],
        sidebar: [
            {
                base: '/guide',
                // collapsed: false,
                // text: 'Guide',
                items: [
                    {link: '/introduction', text: 'Introduction'},
                    {link: '/java', text: 'Bali DI for Java'},
                    {link: '/scala', text: 'Bali DI for Scala'},
                    {link: '/structure', text: 'On Structuring Modules'},
                ],
            },
        ],
    },
    title: 'Bali DI',
})
