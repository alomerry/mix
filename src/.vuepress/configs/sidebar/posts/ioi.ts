import { arraySidebar } from "vuepress-theme-hope";

export const ioi = arraySidebar([
  "",
  {
    text: "算法笔记",
    collapsible: true,
    prefix: "algorithm/",
    children: [
      "kmp",
      "tail-recursion",
      "useful-cpp-lib",
    ],
  },
  {
    text: "数据结构",
    collapsible: true,
    prefix: "data-struct/",
    children: [
      "",
      "sort",
      "graph",
    ],
  },
  {
    text: "PAT 甲级",
    collapsible: true,
    prefix: "pat-a/",
    children: [
      "1001-a+b-format.md",
      "1002-a+b-for-polynomialst.md",
      "1003-emergency.md",
      "1004-counting-leaves.md",
      "1005-spell-it-right.md",
      "1006-sign-in-and-sign-out.md",
      "1007-maximum-subsequence-sum.md",
      "1008-elevator.md",
      "1009-product-of-polynomials.md",
      "1010-radix.md",
      "1011-world-cup-betting.md",
      "1012-the-best-rank.md",
      "1013-battle-over-cities.md",
      "1016-phone-bills.md",
      "1018-public-bike-management.md",
      "1020-tree-traversals.md",
      "1021-deepest-root.md",
      "1025-pat-ranking.md",
      "1028-list-sorting.md",
      "1030-travel-plan.md",
      "1034-head-of-a-gang.md",
      "1043-is-it-a-binary-search-tree.md",
      "1053-path-of-equal-weight.md",
      "1062-talent-and-virtue.md",
      "1064-complete-binary-search-tree.md",
      "1066-root-of-avl-tree.md",
      "1069-the-black-hole-of-numbers.md",
      "1076-forwards-on-weibo.md",
      "1079-total-sales-of-supply-chain.md",
      "1086-tree-traversals-again.md",
      "1087-all-roads-lead-to-rome.md",
      "1089-insert-or-merge.md",
      "1090-highest-price-in-supply-chain.md",
      "1093-count-pat's.md",
      "1094-the-largest-generation.md",
      "1098-insertion-or-heap-sort.md",
      "1099-build-a-binary-search-tree.md",
      "1100-mars-numbers.md",
      "1101-quick-sort.md",
      "1102-invert-a-binary-tree.md",
      "1103-integer-factorization.md",
      "1106-lowest-price-in-supply-chain.md",
      "1107-social-clusters.md",
      "1113-integer-set-partition.md",
      "1115-counting-nodes-in-a-bst.md",
      "1116-come-on!-let's-c.md",
      "1117-eddington-number.md",
      "1120-friend-numbers.md",
      "1121-damn-single.md",
      "1122-hamiltonian-cycle.md",
      "1124-raffle-for-weibo-followers.md",
      "1125-chain-the-ropes.md",
      "1126-eulerian-path.md",
      "1127-zigzagging-on-a-tree.md",
      "1128-n-queens-puzzle.md",
      "1130-infix-expression.md",
      "1132-cut-integer.md",
      "1133-splitting-a-linked-list.md",
      "1134-vertex-cover.md",
      "1135-is-it-a-red-black-tree.md",
      "1137-final-grading.md",
      "1138-postorder-traversal.md",
      "1140-look-and-say-sequence.md",
      "1141-pat-ranking-of-institutions.md",
      "1142-maximal-clique.md",
      "1144-the-missing-number.md",
      "1145-hashing-average-search-time.md",
      "1146-topological-order.md",
      "1147-heaps.md",
      "1148-werewolf-simple-version.md",
      "1149-dangerous-goods-packaging.md",
      "1150-travelling-salesman-problem.md",
      "1151-lca-in-a-binary-tree.md",
      "1152-google-recruitment.md",
      "1154-vertex-coloring.md",
      "1155-heap-paths.md",
    ],
  },
  {
    text: "LeetCode Easy",
    collapsible: true,
    prefix: "leetcode-easy/",
    children: [
      '1-two-sum.md',
      '7-reverse-integer.md',
      '9-palindrome-number.md',
      '13-roman-to-integer.md',
      '14-longest-common-prefix.md',
      '20-valid-parentheses.md',
      '21-merge-two-sorted-lists.md',
      '26-remove-duplicates-from-sorted-array.md',
      '27-remove-element.md',
      '29-divide-two-integers.md',
      '53-maximum-subarray.md',
      '58-length-of-last-word.md',
      '66-plus-one.md',
      '67-add-binary.md',
      '69-sqrtx.md',
      '70-climbing-stairs.md',
      '83-remove-duplicates-from-sorted-list.md',
      '88-merge-sorted-array.md',
      '94-binary-tree-inorder-traversal.md',
      '100-same-tree.md',
      '101-symmetric-tree.md',
      '104-maximum-depth-of-binary-tree.md',
      '169-majority-element.md',
      '1920-build-array-from-permutation.md',
      '2578-split-with-minimum-sum.md',
    ],
  },
  {
    text: "LeetCode Medium",
    collapsible: true,
    prefix: "leetcode-medium/",
    children: [
      '2-add-two-numbers.md',
      '3-longest-substring-without-repeating-characters.md',
      '5-longest-palindromic-substring.md',
      '6-zigzag-conversion.md',
      '8-string-to-integer-atoi.md',
      '11-container-with-most-water.md',
      '12-integer-to-roman.md',
      '15-3sum.md',
      '16-3sum-closest.md',
      '17-letter-combinations-of-a-phone-number.md',
      '18-4sum.md',
      '19-remove-nth-node-from-end-of-list.md',
      '22-generate-parentheses.md',
      '24-swap-nodes-in-pairs.md',
      '28-find-the-index-of-the-first-occurrence-in-a-string.md',
      '33-search-in-rotated-sorted-array.md',
      '35-search-insert-position.md',
      '80-remove-duplicates-from-sorted-array-ii.md',
      '96-unique-binary-search-trees.md',
      '102-binary-tree-level-order-traversal.md',
      '105-construct-binary-tree-from-preorder-and-inorder-traversal.md',
      '106-construct-binary-tree-from-inorder-and-postorder-traversal.md',
      '107-binary-tree-level-order-traversal-ii.md',
      '147-insertion-sort-list.md',
      '189-rotate-array.md',
      '207-course-schedule.md',
      '721-accounts-merge.md',
      '2512-reward-top-k-students.md',
    ],
  },
  {
    text: "LeetCode Hard",
    collapsible: true,
    prefix: "leetcode-hard/",
    children: [
      '4-median-of-two-sorted-arrays.md',
      '10-regular-expression-matching.md',
      '23-merge-k-sorted-lists.md',
      '25-reverse-nodes-in-k-group.md',
    ],
  },
  {
    text: "LeetCode 周赛",
    collapsible: true,
    prefix: "leetcode-weekly-contest/",
    children: [
      '83-weekly-contest.md',
    ],
  },
  {
    text: "LeetCode SQL",
    collapsible: true,
    prefix: "leetcode-sql/",
    children: [
      '175-combine-two-tables.md',
      '176-second-highest-salary.md',
      '177-nth-highest-salary.md',
      '178-rank-scores.md',
      '180-consecutive-numbers.md',
      '181-employees-earning-more-than-their-managers.md',
      '182-duplicate-emails.md',
    ],
  },
  "leet-code-tag",
]);
