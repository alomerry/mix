import { type DefaultTheme } from 'vitepress'
import { BaGuK8S } from './k8s'

export function BaGuCloudNative(): DefaultTheme.SidebarMulti {
  return {
    '/8gu/cloud-native/k8s': BaGuK8S(),
  }
}
