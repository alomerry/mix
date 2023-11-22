import { type DefaultTheme } from 'vitepress'
import { IOI } from './ioi'

export function LeetcodeSQL(): DefaultTheme.SidebarItem[] {
  return [
    ...IOI(),
    {
      text: 'Leetcode SQL',
      items: [
        { text: '175\. 组合两个表', link: '/ioi/leetcode-sql/175' },
        { text: '176\. 第二高的薪水', link: '/ioi/leetcode-sql/176' },
        { text: '177\. 第N高的薪水', link: '/ioi/leetcode-sql/177' },
        { text: '178\. 分数排名', link: '/ioi/leetcode-sql/178' },
        { text: '180\. Consecutive Numbers', link: '/ioi/leetcode-sql/180' },
        { text: '181\. 超过经理收入的员工', link: '/ioi/leetcode-sql/181' },
        { text: '182\. 查找重复的电子邮箱', link: '/ioi/leetcode-sql/182' },
        { text: '184\. 部门工资最高的员工', link: '/ioi/leetcode-sql/184' },
      ]
    },
  ]
}