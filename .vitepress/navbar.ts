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
        { text: 'PAT', link: '/ioi/pat-a/' },
        { text: 'LeetCode Easy', link: '/ioi/leetcode-easy/' },
        { text: 'LeetCode Medium', link: '/ioi/leetcode-medium/' },
        { text: 'LeetCode Hard', link: '/ioi/leetcode-hard/' },
        { text: 'LeetCode Weekly', link: '/ioi/leetcode-weekly/' },
        { text: 'LeetCode SQL', link: '/ioi/leetcode-sql/' },
      ]
    },
    {
      text: 'Knowledge',
      items: [
        { text: 'Database', link: '/knowledge/database/' },
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
        { text: '力扣 简单', link: '/zh/ioi/leetcode-easy/' },
        { text: '力扣 中等', link: '/zh/ioi/leetcode-medium/' },
        { text: '力扣 困难', link: '/zh/ioi/leetcode-hard/' },
        { text: '力扣 周赛', link: '/zh/ioi/leetcode-weekly/' },
        { text: '力扣 SQL', link: '/zh/ioi/leetcode-sql/' },
      ]
    },
    {
      text: '知识',
      items: [
        { text: '数据库', link: '/zh/knowledge/database/' },
      ]
    },
  ]
}

export default {
  Nav, Nav_Zh
}