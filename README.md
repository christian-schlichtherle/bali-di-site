[![Apache License 2.0](https://img.shields.io/github/license/christian-schlichtherle/bali-di-site.svg)](https://www.apache.org/licenses/LICENSE-2.0)

# Bali DI Site

This is the source code repository for the documentation website
[bali-di.namespace.global](https://bali-di.namespace.global).

## Prerequisites

+ [Node.js](https://www.node.js/)

It is recommended to use this repository with Linux or macOS.
Windows may work, but is generally not supported.

    $ npm install

## Development

This repository uses [VuePress](https://vuepress.vuejs.org/).
To start a local development server:

    $ npm run docs:dev

## Build

To build the static site:

    $ npm run docs:build

## Deployment

Every commit on the main branch gets automatically deployed to the website.
