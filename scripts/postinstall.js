import modifySplitFontsCss from "./modify-split-fonts-css.js";
import downloadImport from "./download-import.js";

// 拆分字体之后自动修改字体 css 中字体地址为 cdn 地址
modifySplitFontsCss.run()
// 导入网络地址到本地用语 build
downloadImport.run()