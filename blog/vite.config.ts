import { basename, resolve } from 'node:path'
import { defineConfig } from 'vite'
import fs from 'fs-extra'
import Pages from 'vite-plugin-pages'
import Inspect from 'vite-plugin-inspect'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import Vue from '@vitejs/plugin-vue'
import matter from 'gray-matter'
import AutoImport from 'unplugin-auto-import/vite'
import anchor from 'markdown-it-anchor'
import LinkAttributes from 'markdown-it-link-attributes'
import GitHubAlerts from 'markdown-it-github-alerts'
import UnoCSS from 'unocss/vite'
import SVG from 'vite-svg-loader'

// https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs
// @ts-expect-error missing types
import { full as emojiPlugin } from 'markdown-it-emoji'
import MarkdownItShiki from '@shikijs/markdown-it'
import { tasklist } from '@mdit/plugin-tasklist'
import { imgSize } from '@mdit/plugin-img-size'
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'

// @ts-expect-error missing types
import TOC from 'markdown-it-table-of-contents'

import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers'
import { slugify } from './scripts/slugify'
import {
  containerPlugin,
  footnote,
  pageInfo,
  preWrapperPlugin,
  sub,
  sup,
} from './scripts/md'

const promises: Promise<any>[] = []

export default defineConfig({
  resolve: {
    alias: [{ find: '~/', replacement: `${resolve(__dirname, 'src')}/` }],
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      'dayjs',
      'dayjs/plugin/localizedFormat',
    ],
  },
  plugins: [
    UnoCSS(),

    Vue({
      include: [/\.vue$/, /\.md$/],
      // @ts-expect-error missing types
      reactivityTransform: true,
      script: {
        defineModel: true,
      },
    }),

    Pages({
      extensions: ['vue', 'md'],
      dirs: 'pages',
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))

        if (!path.includes('others.md') && path.endsWith('.md')) {
          const md = fs.readFileSync(path, 'utf-8')
          const { data } = matter(md)
          route.meta = Object.assign(route.meta || {}, { frontmatter: data })
        }

        return route
      },
    }),

    Markdown({
      wrapperComponent: id =>
        id.includes('/demo/') ? 'WrapperDemo' : 'WrapperPost',
      wrapperClasses: (id, code) =>
        code.includes('@layout-full-width')
          ? ''
          : 'prose m-auto slide-enter-content',
      headEnabled: true,
      exportFrontmatter: false,
      exposeFrontmatter: false,
      exposeExcerpt: false,
      markdownItOptions: {
        quotes: '""\'\'',
      },

      async markdownItSetup(md) {
        md.use(
          await MarkdownItShiki({
            themes: {
              dark: 'vitesse-dark',
              light: 'vitesse-light',
            },
            defaultColor: false,
            cssVariablePrefix: '--s-',
            transformers: [
              transformerTwoslash({
                explicitTrigger: true,
                renderer: rendererRich(),
              }),
              transformerNotationFocus({
                classActiveLine: 'has-focus',
                classActivePre: 'has-focused-lines',
              }),
              transformerMetaHighlight(),
              transformerNotationWordHighlight(),
              transformerNotationDiff(),
              transformerNotationErrorLevel(),
              transformerNotationHighlight(),
            ],
          }),
        )

        md.use(anchor, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: () => ({ 'aria-hidden': 'true' }),
          }),
        })

        // 自定义容器
        md.use(containerPlugin)
        md.use(preWrapperPlugin)
        md.use(footnote)
        md.use(sup)
        md.use(tasklist)
        md.use(sub)
        md.use(imgSize)
        md.use(pageInfo)
        md.use(emojiPlugin)

        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })

        md.use(TOC, {
          includeLevel: [1, 2, 3, 4],
          slugify,
          containerHeaderHtml:
            '<div class="table-of-contents-anchor"><div class="i-ri-menu-2-fill" /></div>',
        })

        md.use(GitHubAlerts)
      },
      frontmatterPreprocess(frontmatter, options, id, defaults) {
        (() => {
          if (!id.endsWith('.md'))
            return
          const route = basename(id, '.md')
          if (route === 'index' || frontmatter.image || !frontmatter.title)
            return
          // const path = `og/${route}.png`
          // promises.push(
          //   fs.existsSync(`${id.slice(0, -3)}.png`)
          //     ? fs.copy(`${id.slice(0, -3)}.png`, `public/${path}`)
          //     : generateOg(frontmatter.title!.replace(/\s-\s.*$/, '').trim(), `public/${path}`),
          // )
          // frontmatter.image = `https://blog.alomerry.com/${path}`
          console.log('TODO')
        })()
        const head = defaults(frontmatter, options)
        return { head, frontmatter }
      },
    }),

    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      resolvers: [ElementPlusResolver()],
    }),

    Components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
        ElementPlusResolver(),
      ],
    }),

    Inspect(),

    Icons({
      defaultClass: 'inline',
      defaultStyle: 'vertical-align: sub;',
    }),

    SVG({
      svgo: false,
      defaultImport: 'url',
    }),

    {
      name: 'await',
      async closeBundle() {
        await Promise.all(promises)
      },
    },
  ],

  build: {
    rollupOptions: {
      onwarn(warning, next) {
        if (warning.code !== 'UNUSED_EXTERNAL_IMPORT')
          next(warning)
      },
    },
  },

  ssgOptions: {
    formatting: 'minify',
    format: 'esm',
  },
})
