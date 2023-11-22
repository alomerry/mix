import { type DefaultTheme } from 'vitepress'
import { BaGuK8S } from './k8s'
import { BaGuCAP } from './cap'
export function BaGuCloudNative(): DefaultTheme.SidebarMulti {
  return {
    '/8gu/cloud-native/cap': BaGuCAP(),
    '/8gu/cloud-native/k8s': BaGuK8S(),
  }
}
