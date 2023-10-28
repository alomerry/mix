import { type DefaultTheme } from 'vitepress'

export function IOI(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'IOI', link: '/ioi/' },
    {
      text: 'PAT 甲级',
      base: '/ioi/pat-a/',
      collapsed: false,
      items: [
        { text: 'Didi 一面', link: 'didi' },
      ]
    },
    {
      text: 'LeetCode Easy',
      base: '/ioi/leetcode-easy/',
      collapsed: false,
      items: [
        { text: 'Golang', link: 'language/golang/' },
      ]
    },
    {
      text: 'LeetCode Medium',
      base: '/ioi/leetcode-medium/',
      collapsed: false,
      items: [
        { text: 'Golang', link: 'language/golang/' },
      ]
    },
    {
      text: 'LeetCode Hard',
      base: '/ioi/leetcode-hard/',
      collapsed: false,
      items: [
        { text: 'Golang', link: 'language/golang/' },
      ]
    },
    {
      text: 'LeetCode SQL',
      base: '/ioi/leetcode-sql/',
      collapsed: false,
      items: [
        { text: 'Golang', link: 'language/golang/' },
      ]
    },
  ]
}