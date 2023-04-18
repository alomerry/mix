import fs from "fs"
import utils from "./utils.js"
import constant from "./constant.js"

function run() {
  var file2fontMap = modifyCss()
  if (file2fontMap.length > 0) {
    importCss(file2fontMap)
  }
}

function modifyCss() {
  var splitFontsDirs = utils.getChildDir(constant.ORIGIN_FONT_PATH)
  var file2fontMap = new Map()
  splitFontsDirs.forEach(dir => {
    let fontFileName = dir.match(/fonts\/(.*)/)[1]; // ./src/.vuepress/public/assets/fonts/lxgw-wenkai-gb-regular 获取 fonts/ 后的字符
    let resultCssPath = dir + "/" + "result.css";

    if (utils.existsPath(resultCssPath)) {
      let mdContent = fs.readFileSync(resultCssPath, 'utf8');

      let fontName = mdContent.match(/font-family: "(.*)/)[1] // font-family: "LXGW WenKai GB";

      file2fontMap.set(fontFileName, fontName.substring(0, fontName.lastIndexOf('";')))

      // 将 css 中字体相对路径更新成 cdn 路径
      mdContent = mdContent.replace(/src: url\("\.\//gm, 'src: url("' + constant.CDN_BLOG_URL + "/asserts/fonts/" + fontFileName + "/")
      // // 获取 font 的名字
      fs.writeFileSync(resultCssPath, mdContent, 'utf8')
      console.log("modify result css success")
    }

  });
  return file2fontMap
}

function importCss(file2fontMap) {
  var indexPath = constant.VUEPRESS_PATH + "/styles/index.scss"
  if (utils.existsPath(indexPath)) {
    let mdContent = fs.readFileSync(indexPath, 'utf8');
    // 将 css 中字体相对路径更新成 cdn 路径
    mdContent = mdContent.replace(/\/\/ split-font-css-start([\w\W]*)\/\/ split-font-css-end/gm, getFontcss(file2fontMap))
    // 获取 font 的名字
    fs.writeFileSync(indexPath, mdContent, 'utf8')
  }
}

function appendFonts(file2fontMap) {
  var indexPath = constant.VUEPRESS_PATH + "/styles/palette.scss"
}

function getFontcss(file2fontMap) {
  var fileNames = []
  file2fontMap.forEach(function (font, file, map) {
    fileNames.push('@import "../public/assets/fonts/' + file + '/result.css";\n')
  })
  return '// split-font-css-start\n\n' +
    fileNames.join() +
    '\n// split-font-css-end'
}

export default {
  run
}