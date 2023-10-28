import { PluginConfig } from 'vuepress'
import { App, renderPageContent } from "@vuepress/core";
// import { redirectPlugin } from 'vuepress-plugin-redirect'
// import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { containerPlugin } from '@vuepress/plugin-container'
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { renderProjects } from '../containers/projects'

export const configPlugins: PluginConfig = [
  searchProPlugin({
    indexContent: false
  }),

  // 谷歌统计插件
  // googleAnalyticsPlugin({
  //  id: ''
  // }),

  // 重定向插件
  // redirectPlugin(),

  // 自定义容器插件
  containerPlugin({
    type: 'projects',
    render: (tokens, idx) => {
      return renderProjects(tokens, idx)
    }
  }),
  // {
  //   name: "cdnConvert",
  //   async extendsMarkdown(md) {
  //     const defaultRender = md.renderer.rules.image;
  //     md.renderer.rules.image = (tokens, idx, options, env, self) => {
  //       const token = tokens[idx];
  //       if (token.attrs) {
  //         const src = token.attrs[token.attrIndex('src')][1];
  //         // 替换图片链接中的 @CDN
  //         const modifiedSrc = src.replace(/@CDN/g, "x");
  //         token.attrs[token.attrIndex('src')][1] = modifiedSrc;
  //         // 调用默认的渲染方法继续处理
  //         if (defaultRender) {
  //           return defaultRender(tokens, idx, options, env, self);
  //         }
  //       }
  //       return '';
  //     };
  //   },
  // }
]
