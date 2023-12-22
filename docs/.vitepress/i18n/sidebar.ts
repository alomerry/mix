import { type DefaultTheme as DT } from 'vitepress'
import { Lang, warp, SideWarpCfg as Scfg } from '.'

export function BaGuIndex(lang: Lang): DT.SidebarMulti {
  const sidebar = {
    'algorithm/': [
      { text: '数据结构', link: `${lang}8gu/algorithm/data-struct` },
      { text: 'algorithm', link: `${lang}8gu/algorithm/list` },
    ],
    'language/golang': [
      {
        text: 'Golang',
        link: `index`,
        base: `${lang}8gu/language/golang/`,
        collapsed: false,
        items: [
          {
            text: 'Interview',
            collapsed: false,
            base: `${lang}8gu/language/golang/interview/`,
            items: [
              {
                text: 'index',
                link: `index`,
              },
            ]
          },
          {
            text: 'Keyword',
            collapsed: false,
            base: `${lang}8gu/language/golang/keyword/`,
            items: [
              {
                text: 'Panic & Recover',
                link: `panic-recover`,
              },
              {
                text: 'Defer',
                link: `defer`,
              },
              {
                text: 'Interface',
                link: `interface`,
              },
              {
                text: 'Map',
                link: `map`,
              },
            ]
          },
          {
            text: 'Concurrentcy',
            link: `${lang}8gu/language/golang/concurrency/`,
            base: `${lang}8gu/language/golang/concurrency/`,
            collapsed: false,
            items: [
              {
                text: 'Goroutine',
                base: `${lang}8gu/language/golang/concurrency/goroutine/`,
                items: [
                  {
                    text: 'goroutine',
                    link: `goroutine`,
                  },
                  {
                    text: 'function call',
                    link: `function-call`,
                  },
                  {
                    text: 'netpull',
                    link: `netpull`,
                  },
                ]
              },
              {
                text: 'Sync',
                base: `${lang}8gu/language/golang/concurrency/sync/`,
                items: [
                  {
                    text: 'sync.map',
                    link: `map`,
                  },
                  {
                    text: 'mutex',
                    link: `mutex`,
                  },
                ]
              },
              {
                text: 'channel',
                link: `channel`,
              },
              {
                text: 'context',
                link: `context`,
              },
              {
                text: 'semaphore',
                link: `semaphore`,
              },
            ]
          },
          {
            text: 'compile',
            collapsed: false,
            base: `${lang}8gu/language/golang/compile/`,
            items: [
              {
                text: 'boot',
                link: `boot`
              },
              {
                text: 'cmd',
                link: `cmd`,
              },
              {
                text: 'compile',
                link: `compile`,
              },
            ]
          },
          {
            text: 'Memory',
            collapsed: false,
            base: `${lang}8gu/language/golang/memory/`,
            items: [
              {
                text: 'gc',
                link: `gc`,
              },
              {
                text: 'heap',
                link: `heap`,
              },
            ]
          },
        ]
      },
    ],
    'database/mysql': [
      {
        text: 'MySQL',
        base: `${lang}8gu/database/mysql/`,
        items: [
          { text: 'Intro', link: 'index' },
        ]
      },
    ],
    'database/redis': [
      {
        text: 'Redis',
        base: `${lang}8gu/database/redis/`,
        items: [
          { text: 'Intro', link: 'index' },
          { text: 'Command', link: 'command' },
          { text: 'Interview', link: 'interview' },
        ]
      },
    ],
    'database/mongodb': [
      {
        text: 'MongoDB',
        base: `${lang}8gu/database/mongodb/`,
        items: [
          { text: 'Intro', link: `index` },
        ]
      },
    ],
    'database/elastic-search': [
      {
        text: 'Elastic Search',
        base: `${lang}8gu/database/elastic-search/`,
        items: [
          { text: 'Intro', link: `index` },
        ]
      },
    ],
    'cs/system': [
      { text: 'System', link: `${lang}8gu/system/` },
    ],
    'cs/network': [
      { text: 'Network', link: `${lang}8gu/network/` },
    ],
    'cloud-native/k8s': [
      {
        text: 'Kubernetes',
        link: `${lang}8gu/cloud-native/k8s/`,
        base: `${lang}8gu/cloud-native/k8s/`,
        items: [
          { text: 'Index', link: `index` },
        ]
      },
    ],
  };
  const cfg: Scfg = {
    lang: lang,
    group: '8gu',
    rootSide: BaGu(false, lang),
    subSide: BaGu(true, lang),
    sideMulti: sidebar,
  }
  return warp(cfg);
}

function BaGu(collapsed: boolean, lang: Lang): DT.SidebarItem[] {
  return [
    {
      text: '8gu',
      link: `${lang}8gu/`,
      collapsed: collapsed,
      items: [
        {
          text: 'Language',
          collapsed: collapsed,
          base: `${lang}8gu/language/`,
          items: [
            { text: 'Golang', link: `golang/` },
            // { text: 'Python', link: `${prefix}language/golang/` },
            // { text: 'Rust', link: `${prefix}language/golang/` },
            // { text: 'Java', link: `${prefix}language/golang/` },
            // { text: 'C++', link: `${prefix}language/golang/` },
            // { text: 'C', link: `${prefix}language/golang/` },
          ]
        },
        {
          text: 'Database',
          base: `${lang}8gu/database/`,
          collapsed: collapsed,
          items: [
            { text: 'MySQL', link: `mysql/` },
            { text: 'Redis', link: `redis/` },
            { text: 'MongoDB', link: `mongodb/` },
            { text: 'ElasticSearch', link: `elastic-search/` },
            // { text: 'PostgreSQL', link: `postgresql/` },
            // { text: 'TiDB', link: `mysql/` },
          ]
        },
        {
          text: 'Middleware',
          base: `${lang}8gu/middleware/`,
          collapsed: collapsed,
          items: [
            { text: 'RocketMQ', link: `rocketmq/` },
            { text: 'RabbitMQ', link: `rabbitmq/` },
            { text: 'Kafka', link: `kafka/` },
          ]
        },
        {
          text: 'Cloud Native',
          base: `${lang}8gu/cloud-native/`,
          link: `index`,
          collapsed: collapsed,
          items: [
            { text: 'Kubernetes', link: `k8s/` },
            { text: 'CAP', link: `cap` },
            { text: 'Docker', link: `docker` },
          ]
        },
        {
          text: 'Computer Science',
          collapsed: collapsed,
          base: `${lang}8gu/cs/`,
          items: [
            { text: 'System', link: `system/` },
            { text: 'Network', link: `network/` },
          ]
        },
        {
          text: 'data-struct', link: `${lang}8gu/algorithm/data-struct/`
        }
      ]
    },
  ]
}

export function IOIIndex(lang: Lang): DT.SidebarMulti {
  const sidebar = {
    'leetcode-easy/': [
      {
        text: 'Leetcode Easy',
        base: `${lang}ioi/leetcode-easy/`,
        items: [
          { text: '1. Two Sum', link: `1` },
          { text: '7. Reverse Integer', link: `7` },
          { text: '9. Palindrome Number', link: `9` },
          { text: '13. Roman to Integer', link: `13` },
          { text: '14. Longest Common Prefix', link: `14` },
          { text: '20. Valid Parentheses', link: `20` },
          { text: '21. Merge Two Sorted Lists', link: `21` },
          { text: '26. Remove Duplicates from Sorted Array', link: `26` },
          { text: '26. Remove Duplicates from Sorted Array', link: `27` },
          { text: '29. Divide Two Integers', link: `29` },
          { text: '53. Maximum Subarray', link: `53` },
          { text: '58. Length of Last Word', link: `58` },
          { text: '66. Plus One', link: `66` },
          { text: '67. Add Binary', link: `67` },
          { text: '69. Sqrt(x)', link: `69` },
          { text: '70. Climbing Stairs', link: `70` },
          { text: '83. Remove Duplicates from Sorted List', link: `83` },
          { text: '88. Merge Sorted Array', link: `88` },
          { text: '94. Binary Tree Inorder Traversal', link: `94` },
          { text: '100. Same Tree', link: `100` },
          { text: '101. Symmetric Tree', link: `101` },
          { text: '104. Maximum Depth of Binary Tree', link: `104` },
          { text: '169. 多数元素', link: `169` },
          { text: '1920. Build Array from Permutation', link: `1920` },
          { text: '2525. 根据规则将箱子分类', link: `2525` },
          { text: '2562. 找出数组的串联值', link: `2562` },
          { text: '2578. 最小和分割', link: `2578` },
        ]
      },
    ],
    'leetcode-medium/': [
      {
        text: 'Leetcode Medium',
        base: `${lang}ioi/leetcode-medium/`,
        items: [
          { text: '2. 两数相加', link: `2` },
          { text: '3. 无重复字符的最长子串', link: `3` },
          { text: '5. 最长回文子串', link: `5` },
          { text: '6. Zigzag Conversion', link: `6` },
          { text: '8. String to Integer (atoi)', link: `8` },
          { text: '11. Container With Most Water', link: `11` },
          { text: '12. Integer to Roman', link: `12` },
          { text: '15. 3Sum', link: `15` },
          { text: '16. 3Sum Closest', link: `16` },
          { text: '17. Letter Combinations of a Phone Number', link: `17` },
          { text: '18. 4Sum', link: `18` },
          { text: '19. Remove Nth Node From End of List', link: `19` },
          { text: '22. Generate Parentheses', link: `22` },
          { text: '24. Swap Nodes in Pairs', link: `24` },
          { text: '33. Search in Rotated Sorted Array', link: `33` },
          { text: '35. Search Insert Position', link: `35` },
          { text: '61. 旋转链表', link: `61` },
          { text: '80. 删除有序数组中的重复项 II', link: `80` },
          { text: '82. 删除排序链表中的重复元素 II', link: `82` },
          { text: '92. 反转链表 II', link: `92` },
          { text: '96. Unique Binary Search Trees', link: `96` },
          { text: '102. Binary Tree Level Order Traversal', link: `102` },
          { text: '105. Construct Binary Tree from Preorder and Inorder Traversal', link: `105` },
          { text: '106. Construct Binary Tree from Inorder and Postorder Traversal', link: `106` },
          { text: '107. Binary Tree Level Order Traversal II', link: `107` },
          { text: '147. 对链表进行插入排序', link: `147` },
          { text: '189. 轮转数组', link: `189` },
          { text: '207. Course Schedule', link: `207` },
          { text: '721. Accounts Merge', link: `721` },
          { text: '1488. 避免洪水泛滥', link: `1488` },
          { text: '2316. 统计无向图中无法互相到达点对数', link: `2316` },
          { text: '2512. 奖励最顶尖的 K 名学生', link: `2512` },
        ]
      },
    ],
    'leetcode-hard/': [
      {
        text: 'Leetcode Hard',
        base: `${lang}ioi/leetcode-hard/`,
        items: [
          { text: '4. 寻找两个正序数组的中位数', link: `4` },
          { text: '10. Regular Expression Matching', link: `10` },
          { text: '23. Merge k Sorted Lists', link: `23` },
          { text: '25. K 个一组翻转链表', link: `25` },
          { text: '28. Find the Index of the First Occurrence in a String', link: `28` },
        ]
      },
    ],
    'leetcode-sql/': [
      {
        text: 'Leetcode SQL',
        base: `${lang}ioi/leetcode-sql/`,
        items: [
          { text: '175. 组合两个表', link: `175` },
          { text: '176. 第二高的薪水', link: `176` },
          { text: '177. 第N高的薪水', link: `177` },
          { text: '178. 分数排名', link: `178` },
          { text: '180. Consecutive Numbers', link: `180` },
          { text: '181. 超过经理收入的员工', link: `181` },
          { text: '182. 查找重复的电子邮箱', link: `182` },
          { text: '184. 部门工资最高的员工', link: `184` },
        ]
      },
    ],
    'pat-a/': [
      {
        text: 'PAT Advance',
        base: `${lang}ioi/pat-a/`,
        items: [
          { text: 'xxx', link: `1001` },
        ]
      },
    ],
  }
  const cfg: Scfg = {
    lang: lang,
    group: 'ioi',
    rootSide: IOI(lang),
    subSide: IOI(lang),
    sideMulti: sidebar,
  }
  return warp(cfg);
}

function IOI(lang: Lang): DT.SidebarItem[] {
  return [
    {
      text: 'IOI',
      link: `${lang}ioi/`,
    },
    {
      text: 'LeetCode Easy',
      base: `${lang}ioi/leetcode-easy/`,
      link: `1`,
    },
    {
      text: 'LeetCode Medium',
      base: `${lang}ioi/leetcode-medium/`,
      link: `2`,
    },
    {
      text: 'LeetCode Hard',
      base: `${lang}ioi/leetcode-hard/`,
      link: `4`,
    },
    {
      text: 'LeetCode SQL',
      base: `${lang}ioi/leetcode-sql/`,
      link: `175`,
    },
    {
      text: 'PAT Advance',
      base: `${lang}ioi/pat-a/`,
      link: `1001`,
    },
  ]
}