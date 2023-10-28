import utils from "./utils.js"
import fs from "fs"

run()

function run() {
  let types = [
    "pat-a", // 0
    "leetcode-easy", // 1
    "leetcode-medium", // 2
    "leetcode-hard", // 3
    "leetcode-weekly-contest", // 4
    "leetcode-sql", // 5
  ]

  getSiderBarChildren(types[1])
  getSiderBarChildren(types[2])
  getSiderBarChildren(types[3])
  getSiderBarChildren(types[4])
  getSiderBarChildren(types[5])
}

function getSiderBarChildren(changeType) {
  let prefix = utils.getAbsoluteIOIPath()
  prefix = prefix + "/"

  let path = prefix + changeType

  let newSideBarChildren = utils.tools_IOI_SiderBar_Children_Generator(path, path + "/")

  let newContent = `prefix: "` + changeType + `/",
    children: [
` + newSideBarChildren + `
    ],`
  const ioiSideBarConfig = ".vitepress/sidebar/ioi/en.ts"
  replaceSideBar(ioiSideBarConfig, changeType, newContent)
}

function replaceSideBar(config, changeType, newContent) {
  if (utils.existsPath(config)) {
    let reg;
    switch (changeType) {
      case "leetcode-easy":
        reg = /prefix: "leetcode-easy\/",\n    children: \[\n(( )*'(\w)(\S)*',\n)+( )+\],/
        break
      case "leetcode-medium":
        reg = /prefix: "leetcode-medium\/",\n    children: \[\n(( )*'(\w)(\S)*',\n)+( )+\],/
        break
      case "leetcode-hard":
        reg = /prefix: "leetcode-hard\/",\n    children: \[\n(( )*'(\w)(\S)*',\n)+( )+\],/
        break
      case "leetcode-weekly-contest":
        reg = /prefix: "leetcode-weekly-contest\/",\n    children: \[\n(( )*'(\w)(\S)*',\n)+( )+\],/
        break
      case "leetcode-sql":
        reg = /prefix: "leetcode-sql\/",\n    children: \[\n(( )*'(\w)(\S)*',\n)+( )+\],/
        break
      default:
        return
    }

    let content = fs.readFileSync(config, 'utf8');
    // prefix: "leetcode-medium/",
    // children: [
    //   ...
    // ]

    let result = content.replace(reg, newContent)
    fs.writeFileSync(config, result, 'utf8')
  }
}

export default {
  run
}
