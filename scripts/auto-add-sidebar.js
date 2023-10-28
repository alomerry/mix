import fs from "fs"
import utils from "./utils.js"
import log from "./log.js"

function run() {
  let types = [
    "pat-a", // 0
    "leetcode-easy", // 1
    "leetcode-medium", // 2
    "leetcode-hard", // 3
    "leetcode-sql", // 4
    "leetcode-weekly", // 5
  ]
  // TODO language
  getLeetCodeSiderBarChildren(types[1])
  getLeetCodeSiderBarChildren(types[2])
  getLeetCodeSiderBarChildren(types[3])
  getLeetCodeSiderBarChildren(types[4])
  // getLeetCodeSiderBarChildren(types[5])
}

function getLeetCodeSiderBarChildren(changeType) {
  console.log(log.Warn(`start set sidebar [${log.WarnBg(changeType)}]...`))

  let prefix = utils.getAbsoluteIOIPath()
  prefix = prefix + "/"
  let path = prefix + changeType

  // let newSideBarChildren = utils.tools_IOI_SiderBar_Children_Generator(path, path + "/")
  let titleMapper = getLeetCodeChildrenFileTitle(utils.getDirFilesPath(path))
  const ioiSideBarConfig = ".vitepress/sidebar/ioi/en.ts"
  replaceSideBar(ioiSideBarConfig, changeType, getLeetCodeSidebarRewriteTextByChangeType(changeType, titleMapper))

  console.log(log.Success(`set sidebar [${log.SuccessBg(changeType)}] finished!`))
}

export default {
  run
}

function replaceSideBar(config, changeType, newContent) {
  if (utils.existsPath(config)) {
    let reg;
    switch (changeType) {
      case "leetcode-easy":
        reg = /base: '\/ioi\/leetcode-easy\/',\n( )*collapsed: false,\n( )*items: \[\n(( )*\{( )*text:( )*('|").*('|"),( )*link:( )*('|").*('|")( )*\},\n)*( )+\]/
        break
      case "leetcode-medium":
        reg = /base: '\/ioi\/leetcode-medium\/',\n( )*collapsed: false,\n( )*items: \[\n(( )*\{( )*text:( )*('|").*('|"),( )*link:( )*('|").*('|")( )*\},\n)*( )+\]/
        break
      case "leetcode-hard":
        reg = /base: '\/ioi\/leetcode-hard\/',\n( )*collapsed: false,\n( )*items: \[\n(( )*\{( )*text:( )*('|").*('|"),( )*link:( )*('|").*('|")( )*\},\n)*( )+\]/
        break
      case "leetcode-weekly":
        reg = /base: '\/ioi\/leetcode-weekly\/',\n( )*collapsed: false,\n( )*items: \[\n(( )*\{( )*text:( )*('|").*('|"),( )*link:( )*('|").*('|")( )*\},\n)*( )+\]/
        break
      case "leetcode-sql":
        reg = /base: '\/ioi\/leetcode-sql\/',\n( )*collapsed: false,\n( )*items: \[\n(( )*\{( )*text:( )*('|").*('|"),( )*link:( )*('|").*('|")( )*\},\n)*( )+\]/
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
      result.set(mdPath, titles[0].replace(/#( )*/,"").replace("[","").replace("]",""));
    } else {
      console.log(log.Path(mdPath)+log.Error(" can't find title"))
    }
  });
  return result;
}

// 生成 leetcode sidebar 替换文本
function getLeetCodeSidebarRewriteTextByChangeType(changeType, titleMapper) {
  let childrenText = "";
  let order = [];
  // base: '/ioi/leetcode-easy/',
  // collapsed: false,
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
    let mda = parseInt(utils.getFileName(a).replace(".md",""))
    let mdb = parseInt(utils.getFileName(b).replace(".md",""))
    return mda - mdb
  });

  // 按序填入 item
  order.forEach((mdPath) => {
    childrenText += `\n        { text: '${titleMapper.get(mdPath)}', link: '${utils.getFileName(mdPath).replace(".md","")}' },`
  })
  return `base: '/ioi/`+changeType+ `/',
      collapsed: false,
      items: [`+childrenText+`
      ]`;
}