import { type DefaultTheme } from 'vitepress'

function Nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/' },
    {
      text: '8gu',
      items: [
        {
          text: 'Golang',
          link: '/8gu/golang/'
        },
        {
          text: 'MongoDB',
          link: '/8gu/mongodb/'
        },
        {
          text: 'ElasticSearch',
          link: '/8gu/elastic-search/'
        }
      ]
    },
  ]
}

function Nav_Zh(): DefaultTheme.NavItem[] {
  return [
    { text: '主页', link: '/zh/' },
    {
      text: '八股文',
      items: [
        {
          text: 'Golang',
          link: '/zh/8gu/golang/'
        },
        {
          text: 'MongoDB',
          link: '/zh/8gu/mongodb/'
        },
        {
          text: 'ElasticSearch',
          link: '/zh/8gu/elastic-search/'
        }
      ]
    },
  ]
}

export default {
  Nav, Nav_Zh
}