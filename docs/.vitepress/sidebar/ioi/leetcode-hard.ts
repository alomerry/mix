import { type DefaultTheme } from 'vitepress'
import { IOI } from './ioi'

export function LeetcodeHard(): DefaultTheme.SidebarItem[] {
  return [
    ...IOI(),
    {
      text: 'Leetcode Hard',
      items: [
        { text: '4\. 寻找两个正序数组的中位数', link: '/ioi/leetcode-hard/4' },
        { text: '10\. Regular Expression Matching', link: '/ioi/leetcode-hard/10' },
        { text: '23\. Merge k Sorted Lists', link: '/ioi/leetcode-hard/23' },
        { text: '25\. K 个一组翻转链表', link: '/ioi/leetcode-hard/25' },
        { text: '28\. Find the Index of the First Occurrence in a String', link: '/ioi/leetcode-hard/28' },
      ]
    },
  ]
}