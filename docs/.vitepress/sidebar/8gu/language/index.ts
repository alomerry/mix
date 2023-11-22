import { type DefaultTheme } from 'vitepress'
import { BaGuLanguageGolang } from './golang'

export function BaGuLanguage(): DefaultTheme.SidebarMulti {
  return {
    '/8gu/language/golang': BaGuLanguageGolang(),
  }
}