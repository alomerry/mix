import { type DefaultTheme } from 'vitepress'
// import golang from "./golang.js"
import baGu from "./8gu.js"

export enum SidebarType {
  BaGu,
  BaGu_Zh,
}

export const SidebarConfig = ({
  Get(name: SidebarType):DefaultTheme.SidebarItem[] {
    switch (name) {
      // TODO: refine suffix
      case SidebarType.BaGu:
        return [...baGu.Sidebar()];
      case SidebarType.BaGu_Zh:
          return [...baGu.SidebarZh()];
      default:
        return [];
    }
  }
})
