import { type DefaultTheme } from 'vitepress'
import { BaGu } from '../8gu'

export function BaGuRedis(): DefaultTheme.SidebarItem[] {
  return [
    ...BaGu(),
    {
      text: 'Redis',
      items: [
        { text: 'Intro', link: '/8gu/database/redis/' },
        { text: 'Command', link: '/8gu/database/redis/command' },
        { text: 'Interview', link: '/8gu/database/redis/interview' },
      ]
    },
  ]
}