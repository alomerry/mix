import { type DefaultTheme } from 'vitepress'
import { IOI } from './ioi'

export function PAT_A(): DefaultTheme.SidebarItem[] {
  return [
    ...IOI(),
    {
      text: 'PAT Advance',
      items: [
        { text: 'xxx', link: '/ioi/pat-a/1001' },
      ]
    },
  ]
}