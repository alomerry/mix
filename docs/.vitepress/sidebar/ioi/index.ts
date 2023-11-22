import { type DefaultTheme } from 'vitepress';
import { IOI } from './ioi';
import { LeetcodeEasy } from './leetcode-easy';
import { LeetcodeMedium } from './leetcode-medium';
import { LeetcodeHard } from './leetcode-hard';
import { LeetcodeSQL } from './leetcode-sql';
import { PAT_A } from './pat-a';

export function IOIIndex(): DefaultTheme.SidebarMulti {
  return {
    '/ioi/index': IOI(),
    '/ioi/leetcode-easy': LeetcodeEasy(),
    '/ioi/leetcode-medium': LeetcodeMedium(),
    '/ioi/leetcode-hard': LeetcodeHard(),
    '/ioi/leetcode-sql': LeetcodeSQL(),
    '/ioi/pat-a': PAT_A(),
  }
}
