import { type DefaultTheme } from 'vitepress'
import { IOI } from './ioi'

export function LeetcodeEasy(): DefaultTheme.SidebarItem[] {
  return [
    ...IOI(),
    {
      text: 'Leetcode Easy',
      items: [
        { text: '1\. 两数之和', link: '/ioi/leetcode-easy/1' },
        { text: '7\. Reverse Integer', link: '/ioi/leetcode-easy/7' },
        { text: '9\. Palindrome Number', link: '/ioi/leetcode-easy/9' },
        { text: '13\. Roman to Integer', link: '/ioi/leetcode-easy/13' },
        { text: '14\. Longest Common Prefix', link: '/ioi/leetcode-easy/14' },
        { text: '20\. Valid Parentheses', link: '/ioi/leetcode-easy/20' },
        { text: '21\. Merge Two Sorted Lists', link: '/ioi/leetcode-easy/21' },
        { text: '26\. Remove Duplicates from Sorted Array', link: '/ioi/leetcode-easy/26' },
        { text: '26\. Remove Duplicates from Sorted Array', link: '/ioi/leetcode-easy/27' },
        { text: '29\. Divide Two Integers', link: '/ioi/leetcode-easy/29' },
        { text: '53\. Maximum Subarray', link: '/ioi/leetcode-easy/53' },
        { text: '58\. Length of Last Word', link: '/ioi/leetcode-easy/58' },
        { text: '66\. Plus One', link: '/ioi/leetcode-easy/66' },
        { text: '67\. Add Binary', link: '/ioi/leetcode-easy/67' },
        { text: '69\. Sqrt(x)', link: '/ioi/leetcode-easy/69' },
        { text: '70\. Climbing Stairs', link: '/ioi/leetcode-easy/70' },
        { text: '83\. Remove Duplicates from Sorted List', link: '/ioi/leetcode-easy/83' },
        { text: '88\. Merge Sorted Array', link: '/ioi/leetcode-easy/88' },
        { text: '94\. Binary Tree Inorder Traversal', link: '/ioi/leetcode-easy/94' },
        { text: '100\. Same Tree', link: '/ioi/leetcode-easy/100' },
        { text: '101\. Symmetric Tree', link: '/ioi/leetcode-easy/101' },
        { text: '104\. Maximum Depth of Binary Tree', link: '/ioi/leetcode-easy/104' },
        { text: '169\. 多数元素', link: '/ioi/leetcode-easy/169' },
        { text: '1920\. Build Array from Permutation', link: '/ioi/leetcode-easy/1920' },
        { text: '2525\. 根据规则将箱子分类', link: '/ioi/leetcode-easy/2525' },
        { text: '2562\. 找出数组的串联值', link: '/ioi/leetcode-easy/2562' },
        { text: '2578\. 最小和分割', link: '/ioi/leetcode-easy/2578' },
      ]
    },
  ]
}