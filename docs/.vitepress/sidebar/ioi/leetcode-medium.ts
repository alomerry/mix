import { type DefaultTheme } from 'vitepress'
import { IOI } from './ioi'

export function LeetcodeMedium(): DefaultTheme.SidebarItem[] {
  return [
    ...IOI(),
    {
      text: 'Leetcode Medium',
      items: [
        { text: '2\. 两数相加', link: '/ioi/leetcode-medium/2' },
        { text: '3\. 无重复字符的最长子串', link: '/ioi/leetcode-medium/3' },
        { text: '5\. 最长回文子串', link: '/ioi/leetcode-medium/5' },
        { text: '6\. Zigzag Conversion', link: '/ioi/leetcode-medium/6' },
        { text: '8\. String to Integer (atoi)', link: '/ioi/leetcode-medium/8' },
        { text: '11\. Container With Most Water', link: '/ioi/leetcode-medium/11' },
        { text: '12\. Integer to Roman', link: '/ioi/leetcode-medium/12' },
        { text: '15\. 3Sum', link: '/ioi/leetcode-medium/15' },
        { text: '16\. 3Sum Closest', link: '/ioi/leetcode-medium/16' },
        { text: '17\. Letter Combinations of a Phone Number', link: '/ioi/leetcode-medium/17' },
        { text: '18\. 4Sum', link: '/ioi/leetcode-medium/18' },
        { text: '19\. Remove Nth Node From End of List', link: '/ioi/leetcode-medium/19' },
        { text: '22\. Generate Parentheses', link: '/ioi/leetcode-medium/22' },
        { text: '24\. Swap Nodes in Pairs', link: '/ioi/leetcode-medium/24' },
        { text: '33\. Search in Rotated Sorted Array', link: '/ioi/leetcode-medium/33' },
        { text: '35\. Search Insert Position', link: '/ioi/leetcode-medium/35' },
        { text: '61\. 旋转链表', link: '/ioi/leetcode-medium/61' },
        { text: '80\. 删除有序数组中的重复项 II', link: '/ioi/leetcode-medium/80' },
        { text: '82\. 删除排序链表中的重复元素 II', link: '/ioi/leetcode-medium/82' },
        { text: '92\. 反转链表 II', link: '/ioi/leetcode-medium/92' },
        { text: '96\. Unique Binary Search Trees', link: '/ioi/leetcode-medium/96' },
        { text: '102\. Binary Tree Level Order Traversal', link: '/ioi/leetcode-medium/102' },
        { text: '105\. Construct Binary Tree from Preorder and Inorder Traversal', link: '/ioi/leetcode-medium/105' },
        { text: '106\. Construct Binary Tree from Inorder and Postorder Traversal', link: '/ioi/leetcode-medium/106' },
        { text: '107\. Binary Tree Level Order Traversal II', link: '/ioi/leetcode-medium/107' },
        { text: '147\. 对链表进行插入排序', link: '/ioi/leetcode-medium/147' },
        { text: '189\. 轮转数组', link: '/ioi/leetcode-medium/189' },
        { text: '207\. Course Schedule', link: '/ioi/leetcode-medium/207' },
        { text: '721\. Accounts Merge', link: '/ioi/leetcode-medium/721' },
        { text: '1488\. 避免洪水泛滥', link: '/ioi/leetcode-medium/1488' },
        { text: '2316\. 统计无向图中无法互相到达点对数', link: '/ioi/leetcode-medium/2316' },
        { text: '2512\. 奖励最顶尖的 K 名学生', link: '/ioi/leetcode-medium/2512' },
      ]
    },
  ]
}