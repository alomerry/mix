import utils from "./utils.js"
import fs from "fs"

run()

function run() {
  getSiderBarChildren()
}

function getSiderBarChildren() {
  let changeType = "leetcode-weekly-contest";
  let prefix = utils.getAbsoluteIOIPath()
  prefix = prefix + "/"

  let path = prefix + changeType

  let newSideBarChildren = utils.tools_IOI_SiderBar_Children_Generator(path, path + "/")

  let newContent = `prefix: "` + changeType + `/",
    children: [
` + newSideBarChildren + `
    ],`
  const ioiSideBarConfig = "./src/.vuepress/configs/sidebar/posts/ioi.ts"
  replaceSideBar(ioiSideBarConfig, newContent)
}

function replaceSideBar(config, newContent) {
  if (utils.existsPath(config)) {
    let reg = /prefix: "leetcode-weekly-contest\/",\n    children: \[\n(( )*'(\w)(\S)*',\n)+( )+\],/
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
