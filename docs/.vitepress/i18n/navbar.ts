import { type DefaultTheme as DT } from 'vitepress'
import { Lang, pack, LocaleWarpCfg as Lcfg } from '.'

export function Nav(lang: Lang): DT.NavItem[] {
  const nav = [
    { text: 'Home', link: `${lang}` },
    { text: '8gu', link: `${lang}8gu/` },
    { text: 'IOI', link: `${lang}ioi/` },
  ];
  const cfg: Lcfg = {
    lang: lang,
    navs: nav,
    sidebars: undefined,
    type: 'nav',
  };

  return pack(cfg) as (DT.NavItem[] | undefined) || [];
}
