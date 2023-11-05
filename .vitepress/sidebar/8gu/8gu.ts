import { type DefaultTheme } from 'vitepress'

export function BaGu(): DefaultTheme.SidebarItem[] {
  return [
    { 
      text: '8gu', 
      link: '/8gu/',
      collapsed: false,
      items: [
        {
          text: 'Language',
          collapsed: false,
          items: [
            { text: 'Golang', link: '/8gu/language/golang/' },
            // { text: 'Python', link: '/8gu/language/golang/' },
            // { text: 'Rust', link: '/8gu/language/golang/' },
            // { text: 'Java', link: '/8gu/language/golang/' },
            // { text: 'C++', link: '/8gu/language/golang/' },
            // { text: 'C', link: '/8gu/language/golang/' },
          ]
        },
        {
          text: 'Database',
          // link: '/8gu/database/',
          collapsed: false,
          items: [
            { text: 'MySQL', link: '/8gu/database/mysql/' },
            { text: 'Redis', link: '/8gu/database/redis/' },
            { text: 'MongoDB', link: '/8gu/database/mongodb/' },
            { text: 'ElasticSearch', link: '/8gu/database/elastic-search/' },
            // { text: 'PostgreSQL', link: '/8gu/database/postgresql/' },
            // { text: 'TiDB', link: '/8gu/database/mysql/' },
          ]
        },
        {
          text: 'Middleware',
          collapsed: false,
          items: [
            { text: 'RocketMQ', link: '/8gu/middleware/rocketmq/' },
            { text: 'RabbitMQ', link: '/8gu/middleware/rabbitmq/' },
            { text: 'Kafka', link: '/8gu/middleware/kafka/' },
          ]
        },
        {
          text: 'Container',
          link: '/8gu/container/',
          collapsed: false,
          items: [
            { text: 'Docker', link: '/8gu/container/docker/' },
          ]
        },
        {
          text: 'Cloud Native',
          collapsed: false,
          items: [
            { text: 'Kubernetes', link: '/8gu/cloud-native/k8s/' },
            // { text: 'CAP', link: '/8gu/cloud-native/cap' },
          ]
        },
        {
          text: 'Computer Science',
          collapsed: false,
          items: [
            { text: 'System', link: '/8gu/cs/system/' },
            { text: 'Network', link: '/8gu/cs/network/' },
          ]
        }
      ]
     },
  ]
}
