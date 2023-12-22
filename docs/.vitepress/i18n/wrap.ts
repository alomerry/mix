import { type DefaultTheme as DT } from 'vitepress';
import { Lang } from '.';
import { en, zh } from '.';

export type SideWarpCfg = {
  lang: Lang,
  group: string,
  rootSide: DT.SidebarItem[],
  subSide: DT.SidebarItem[],
  sideMulti: DT.SidebarMulti
}

export type LocaleWarpCfg = {
  lang: Lang,
  navs: DT.NavItem[] | undefined,
  sidebars: DT.SidebarItem[] | undefined,
  type: string
}

export const warp = (cfg: SideWarpCfg) => {
  const prefix = `${cfg.lang}${cfg.group}`;
  const res: DT.SidebarMulti = {
    [`${prefix}/`]: pack({
      lang: cfg.lang,
      navs: undefined,
      sidebars: cfg.rootSide,
      type: 'sidebar',
    }) || cfg.rootSide,
  };
  const lcfg: LocaleWarpCfg = {
    lang: cfg.lang,
    navs: undefined,
    sidebars: undefined,
    type: 'sidebar',
  };
  Object.keys(cfg.sideMulti).map((path) => {
    lcfg.sidebars = [...cfg.subSide, ...(cfg.sideMulti[path] as DT.SidebarItem[])];
    res[`${prefix}/${path}`] = pack(lcfg) || [...cfg.subSide, ...(cfg.sideMulti[path] as DT.SidebarItem[])];
  })

  if (cfg.group === 'ioi') {
    // console.log(res)
  }
  return res;
}

export const pack = (cfg: LocaleWarpCfg) => {
  let locale: any;
  switch (cfg.lang) {
    case Lang.EN:
      locale = en;
      break;
    case Lang.ZH_CN:
      locale = zh;
      break;
  }
  switch (cfg.type) {
    case 'nav':
      const navRes: DT.NavItem[] = [];
      cfg.navs?.forEach((nav) => {
        // console.log(nav.text, locale.nav[`${nav.text}`])
        nav.text = locale.nav[`${nav.text}`]
        navRes.push(nav)
      })
      return navRes;
    case 'sidebar':
      const res: DT.SidebarItem[] = [];
      if (cfg.sidebars?.length) {
        res.push(...dpSidebarText(cfg.sidebars, locale));
      }
      return res;
  }
  return undefined;
}

const dpSidebarText = (sidebars: DT.SidebarItem[] | undefined, locale: any) => {
  if (sidebars && sidebars.length > 0) {
    const res: DT.SidebarItem[] = [];
    sidebars.forEach((sidebar) => {
      if (sidebar.text && locale.sidebar[`${sidebar.text}`]) {
        sidebar.text = locale.sidebar[`${sidebar.text}`];
      }
      if (sidebar.items?.length) {
        sidebar.items = dpSidebarText(sidebar.items, locale);
      }
      res.push(sidebar);
    })
    return res;
  }
  return [];
}