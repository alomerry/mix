import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './font.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // register your custom global components
    // app.component('MyGlobalComponent' /* ... */)
  }
}