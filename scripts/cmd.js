import umami from "./umami-trace.js"
import modifySplitFontsCss from "./modify-split-fonts-css.js";
import downloadImport from "./download-import.js";
import splitFonts from "./split-fonts.js";
import convertCDN from "./convert-cdn-alias.js";
import autoAddIOISidebar from "./auto-add-ioi-sidebar.js";


const CONVERT_CDN = "convertCDN" // 将 markdown 文件中的 @CDN 转为相对路径的 cdn 前缀，并将相对路径下的 assets 文件复制到 public 中，以备上传到 OSS 中
const DOWNLOAD_IMPORT_CODE = "downloadImportCode" // 将 markdown 文件中引用 _codes 的文件中的代码从 gitee 下载到 _codes 目录
const SPLIT_FONTS = "splitFonts" // 切割 public 目录中的 fonts 文件，并按照字体生成对应的引用 CSS
const MODIFY_SPLIT_FONTS_CSS = "modifySplitFontsCss" // 将切割字体后生成 CSS 中引用的字体地址更新成 CDN 字体
const ADD_UMAMI_TRACE = "addUmamiTrace"
const AUTO_GEN_IOI_SIDEBAR = "autoGenIOISidebar" // 自动生成 ioi 的 sidebar 配置

const COMMANDS_MAPPER = new Map([
  [CONVERT_CDN, "执行转换 @CDN 并复制 assets 到 public 路径"],
  [DOWNLOAD_IMPORT_CODE, "执行从 gitee 下载代码到 _codes"],
  [SPLIT_FONTS, "执行字体切割"],
  [MODIFY_SPLIT_FONTS_CSS, "执行字体 CSS 修改成 CDN 地址"],
  [ADD_UMAMI_TRACE, "执行添加 umami 访问跟踪"],
  [AUTO_GEN_IOI_SIDEBAR, "自动生成 ioi 的 sidebar 配置"],
])

process.argv.forEach((val, index) => {
  if (index < 2) {
    return
  }

  console.log(COMMANDS_MAPPER.get(val))
  switch (val) {
    case ADD_UMAMI_TRACE: umami.run()
    case SPLIT_FONTS: splitFonts.run()
    case MODIFY_SPLIT_FONTS_CSS: modifySplitFontsCss.run()
    case DOWNLOAD_IMPORT_CODE: downloadImport.run()
    case CONVERT_CDN: convertCDN.run()
    case AUTO_GEN_IOI_SIDEBAR: autoAddIOISidebar.run()
  }

})