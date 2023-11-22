import { type DefaultTheme } from 'vitepress';
import { BaGu } from './8gu';
import { BaGuLanguage } from './language';
import { BaGuDatabase } from './database';
import { BaGuAlgorithm } from './algorithm';
import { BaGuCS } from './cs';
import { BaGuCloudNative } from './cloud-native';

export function BaGuIndex(): DefaultTheme.SidebarMulti {
  return {
    '/8gu/index': BaGu(),
    '/8gu/algorithm': BaGuAlgorithm(),
    ...BaGuLanguage(),
    ...BaGuDatabase(),
    ...BaGuCS(),
    ...BaGuCloudNative(),
  }
}
