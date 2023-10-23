import { type DefaultTheme } from 'vitepress'
// import golang from "./golang.js"
import baGu from "./8gu.js"

export enum SidebarType {
  BaGu,
}

export const SidebarConfig = ({
  Get(name: SidebarType):DefaultTheme.SidebarItem[] {
    switch (name) {
      case SidebarType.BaGu:
        return [...baGu.Sidebar()];
      default:
        return [];
    }
  }
})
