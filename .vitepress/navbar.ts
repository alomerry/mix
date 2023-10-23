import { type DefaultTheme } from 'vitepress'

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/' },
    {
      text: '8gu',
      items: [
        {
          text: 'Golang',
          link: '/8gu/golang/README.md'
        },
        {
          text: 'MongoDB',
          link: '/8gu/mongodb/README.md'
        },
        {
          text: 'ElasticSearch',
          link: '/8gu/elastic-search/README.md'
        }
      ]
    },
    {
      text: 'Reference',
      link: '/reference/site-config',
      activeMatch: '/reference/'
    },
  ]
}

export default {
  nav
}