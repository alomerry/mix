import fs from "fs"
import utils from "./utils.js"
import log from "./log.js"

const sidebarTypes = [
  // {
  //   category: "ioi",
  //   subs: ["pat-a", "leetcode-easy", "leetcode-medium", "leetcode-hard", "leetcode-sql" ], // "leetcode-weekly"
  // },
  {
    category: "8gu",
    subs: ["database"],//"case", "cloud-native", "database", "language", "message-queue", "network", "network", "system"],
  }
];

const sidebarChildTitleFilterRegMapper = new Map([
  ['ioi', /#( )+\[(0|1|2|3|4|5|6|7|8|9)+(\\|\.| )*(.*)\]/],
  ['8gu', /#( )+/],
]);

function run() {
  sidebarTypes.forEach((type) => {
    type.subs.forEach((subCategory) => {
      // console.log(log.Warn(`start set ${type.category} sidebar [${log.WarnBg(subCategory)}]...`))
      switch (type.category) {
        case 'ioi':
          getLeetCodeSideBarChildren(type);
          break;
        case '8gu':
          console.log(JSON.stringify(GenSidebar(type.category, [subCategory])));
          break;
      }
      // console.log(log.Success(`set ${type.category} sidebar [${log.SuccessBg(subCategory)}] finished!`))
    })
  })
}

function getLeetCodeSideBarChildren(changeType) {
  let path = utils.getAbsolutePath("./ioi/") + "/" + changeType
  let titleMapper = getLeetCodeChildrenFileTitle(utils.getDirFilesPath(path))
  const ioiSideBarConfig = ".vitepress/sidebar/ioi/en.ts"
  replaceSideBar(ioiSideBarConfig, changeType, getLeetCodeSidebarRewriteTextByChangeType(changeType, titleMapper))

  console.log(log.Success(`set sidebar [${log.SuccessBg(changeType)}] finished!`))
}

function GenSidebar(category, subCategories) {
  // find sub child mds and make sidebar
  let path = utils.getAbsolutePath(`./${category}/`) + "/" + subCategories.join('/');
  let subDirs = utils.getSubDir(path)
  let result = [];
  if (subDirs.length > 0) {
    subDirs.forEach((subDir) => {
      result.push(GenSidebar(category, [...subCategories, subDir]));
    })
  } else {
    // [ { text: 'xxx', link: 'xxx' }]
    result = getMdTitles(/#( )+(.*)/, utils.getDirFilesPath(path))
  }
  return {
    text: category,
    base: 'xxxx',
    items: result,
  }
  // {
  //   text: 'LeetCode Easy',
  //   base: '/ioi/leetcode-easy/',
  //   items: [
  //     { text: '1\. 两数之和', link: '1' },
  //   ]
  // },
}

function GenSidebar1(category, subCategory) {
  let path = utils.getAbsolutePath(`./${category}/`) + "/" + subCategory
  let titleMapper = getLeetCodeChildrenFileTitle(utils.getDirFilesPath(path))
  const ioiSideBarConfig = `.vitepress/sidebar/${category}/en.ts`
  replaceSideBar(ioiSideBarConfig, subCategory, getLeetCodeSidebarRewriteTextByChangeType(subCategory, titleMapper))
}

export default {
  run
}

function replaceSideBar(config, changeType, newContent) {
  if (utils.existsPath(config)) {
    let reg;
    switch (changeType) {
      case "leetcode-easy":
        reg = /base: '\/ioi\/leetcode-easy\/',\n( )*collapsed: true,\n( )*items: \[\n(( )*\{( )*text:( )*('|").*('|"),( )*link:( )*('|").*('|")( )*\},\n)*( )+\]/
        break
      case "leetcode-medium":
        reg = /base: '\/ioi\/leetcode-medium\/',\n( )*collapsed: true,\n( )*items: \[\n(( )*\{( )*text:( )*('|").*('|"),( )*link:( )*('|").*('|")( )*\},\n)*( )+\]/
        break
      case "leetcode-hard":
        reg = /base: '\/ioi\/leetcode-hard\/',\n( )*collapsed: true,\n( )*items: \[\n(( )*\{( )*text:( )*('|").*('|"),( )*link:( )*('|").*('|")( )*\},\n)*( )+\]/
        break
      case "leetcode-weekly":
        reg = /base: '\/ioi\/leetcode-weekly\/',\n( )*collapsed: true,\n( )*items: \[\n(( )*\{( )*text:( )*('|").*('|"),( )*link:( )*('|").*('|")( )*\},\n)*( )+\]/
        break
      case "leetcode-sql":
        reg = /base: '\/ioi\/leetcode-sql\/',\n( )*collapsed: true,\n( )*items: \[\n(( )*\{( )*text:( )*('|").*('|"),( )*link:( )*('|").*('|")( )*\},\n)*( )+\]/
        break
      default:
        return
    }

    let content = fs.readFileSync(config, 'utf8');
    let result = content.replace(reg, newContent)
    fs.writeFileSync(config, result, 'utf8')
  }
}

function getLeetCodeChildrenFileTitle(children) {
  let reg = /#( )+\[(0|1|2|3|4|5|6|7|8|9)+(\\|\.| )*(.*)\]/;
  let result = new Map();
  children.forEach(mdPath => {
    let content = fs.readFileSync(mdPath, 'utf8');
    let titles = content.match(reg)
    if (titles) {
      result.set(mdPath, titles[0].replace(/#( )*/, "").replace("[", "").replace("]", ""));
    } else {
      console.log(log.Path(mdPath) + log.Error(" can't find title"))
    }
  });
  return result;
}

// 生成 leetcode sidebar 替换文本
function getLeetCodeSidebarRewriteTextByChangeType(changeType, titleMapper) {
  let childrenText = "";
  let order = [];
  // base: '/ioi/leetcode-easy/',
  // collapsed: true,
  // items: [
  //   { text: '...', link: '...' },
  // ]

  // 按照题目序号排序
  titleMapper.forEach((title, mdPath) => {
    if (!title || !mdPath) {
      console.log(log.ErrorBg(`invalid title or md [${mdPath}]`))
    }
    order.push(mdPath)
  })
  order.sort((a, b) => {
    let mda = parseInt(utils.getFileName(a).replace(".md", ""))
    let mdb = parseInt(utils.getFileName(b).replace(".md", ""))
    return mda - mdb
  });

  // 按序填入 item
  order.forEach((mdPath) => {
    childrenText += `\n        { text: '${titleMapper.get(mdPath)}', link: '${utils.getFileName(mdPath).replace(".md", "")}' },`
  })
  return `base: '/ioi/` + changeType + `/',
      collapsed: true,
      items: [`+ childrenText + `
      ]`;
}

// 将 mdFilePaths 用 reg 提取出 title
function getMdTitles(reg, mdFilePaths) {
  let result = [];
  mdFilePaths.forEach(mdPath => {
    let content = fs.readFileSync(mdPath, 'utf8');
    let titles = content.match(reg)
    if (!(titles && titles.length > 0)) {
      log.Log(log.Path(mdPath) + log.Error(" can't find title"))
    } else if (titles[0].indexOf("/>") !== -1) {
      log.Log(log.Path(mdPath) + log.Error(" h1 not support HTML tag [<,/>] yet."))
    } else {
      result.push({ text: titles[0].replace(/#( )*/, "").replace("[", "").replace("]", ""), link: mdPath },)
    }
  });
  return result;
}
