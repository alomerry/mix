import { type DefaultTheme } from 'vitepress'
import { BaGu } from '../8gu'

export function BaGuK8S(): DefaultTheme.SidebarItem[] {
  return [
    ...BaGu(),
    {
      text: 'Kubernetes',
      link: '/8gu/cloud-native/k8s/',
      items: []
    },
  ]
}
