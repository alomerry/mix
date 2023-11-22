import { type DefaultTheme } from 'vitepress'

function Nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/' },
    { text: '8gu', link: '/8gu/' },
    { text: 'IOI', link: '/ioi/' },
  ]
}

function Nav_Zh(): DefaultTheme.NavItem[] {
  return [
  ]
}

export default {
  Nav, Nav_Zh
}