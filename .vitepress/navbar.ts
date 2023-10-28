import { type DefaultTheme } from 'vitepress'

function Nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/' },
    {
      text: '8gu',
      items: [
        { text: 'Case', link: '/8gu/case/' },
        { text: 'Language', link: '/8gu/language/' },
        { text: 'Database', link: '/8gu/database/' },
      ]
    },
    {
      text: 'IOI',
      items: [
        { text: 'LeetCode', link: '/ioi/leetcode-easy/1' },
        { text: 'PAT', link: '/ioi/pat-a/1001' },
      ]
    },
  ]
}

function Nav_Zh(): DefaultTheme.NavItem[] {
  return [
    { text: '主页', link: '/zh/' },
    {
      text: '八股文',
      items: [
        { text: '面经', link: '/zh/8gu/case/' },
        { text: '编程语言', link: '/zh/8gu/language/' },
        { text: '数据库', link: '/zh/8gu/database/' },
      ]
    },
    {
      text: 'IOI',
      items: [
        { text: 'PAT', link: '/zh/ioi/pat-a/' },
        { text: '力扣', link: '/zh/ioi/leetcode-easy/1' },
      ]
    },
  ]
}

export default {
  Nav, Nav_Zh
}