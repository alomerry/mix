import { type DefaultTheme } from 'vitepress'
import knowledge from "./knowledge.js"
import baGu from "./8gu.js"

export enum SidebarType {
  BaGu,
  BaGu_Zh,
  Knowledge,
  Knowledge_Zh,
}

export const SidebarConfig = ({
  Get(name: SidebarType):DefaultTheme.SidebarItem[] {
    switch (name) {
      // TODO: refine suffix
      case SidebarType.BaGu:
        return [...baGu.Sidebar()];
      case SidebarType.BaGu_Zh:
        return [...baGu.SidebarZh()];
      case SidebarType.Knowledge:
        return [...knowledge.Sidebar()];
      case SidebarType.Knowledge_Zh:
        return [...knowledge.SidebarZh()];
      default:
        return [];
    }
  }
})
