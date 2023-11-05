import { type DefaultTheme } from 'vitepress'

export function IOI(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'IOI', link: '/ioi/' },
    { text: 'LeetCode Easy', link: '/ioi/leetcode-easy/1' },
    { text: 'LeetCode Medium', link: '/ioi/leetcode-medium/2' },
    { text: 'LeetCode Hard', link: '/ioi/leetcode-hard/4' },
    { text: 'LeetCode SQL', link: '/ioi/leetcode-sql/175' },
    { text: 'PAT 甲级', link: '/ioi/pat-a/1001' },
  ]
}