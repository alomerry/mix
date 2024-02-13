export const button_english_only_enable = false

export declare interface Categories {
  name: string
  to: string
}

export declare interface SubCategories {
  name: string
  to: string
  level: number
}

export const categories: Categories[] = [
  { name: '博文', to: '/posts' },
  { name: '笔记', to: '/docs' },
]

// const subCategories: Map<string, Categories> = new Map([
//   ['cloud-native', { name: '云原生', to: '/docs/cloud-native' }],
//   ['k8s', { name: 'Kubernetes', to: '/docs/cloud-native/k8s' }],
// ])

// 最多支持三级
const subCategoriesMap = new Map([
  ['docs', ['cloud-native']],
  ['cloud-native', ['k8s']],
])

export function subCategories(type: string | undefined): Categories[] {
  if (!type)
    return []

  const result: Categories[] = []
  const types = type.split('/')
  if (types.length > 1)
    types.pop()

  // const level = 1
  while (types.length > 0) {
    const top = types.shift()
    if (top) {
      const next = subCategoriesMap.get(top)
      if (next) {
        //
      }
    }
  }
  return result
}
