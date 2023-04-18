import { PluginConfig } from 'vuepress'
// import { redirectPlugin } from 'vuepress-plugin-redirect'
import { PluginsOptions } from 'vuepress-theme-hope'
// import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { containerPlugin } from '@vuepress/plugin-container'
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { renderProjects } from '../containers/projects'

export const configPlugins: PluginConfig = [
  searchProPlugin({
    indexContent: true
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
]