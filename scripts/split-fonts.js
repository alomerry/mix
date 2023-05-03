import { fontSplit } from "@konghayao/cn-font-split";
import utils from "./utils.js";
import constant from "./constant.js";

let fontName = "lxgw-wenkai-gb-regular"
let fontType = ".ttf"
let path = constant.ORIGIN_FONT_PATH
let destPath = path + "/" + fontName

function run() {
    utils.clearDir(destPath)
    split()
}

function split() {
    try {
        fontSplit({
            FontPath: path + "/" + fontName + fontType,
            destFold: destPath,
            css: {
                // fontFamily: "站酷庆科黄油体", // 不建议使用，我们已经有内置的解析模块了
                // fontWeight: 400,
            },
            targetType: "ttf", // ttf woff woff2；注意 eot 文件在浏览器中的支持度非常低，所以不进行支持
            // chunkSize: 200 * 1024, // 如果需要的话，自己定制吧
            testHTML: false, // 输出一份 html 报告文件
            reporter: false, // 输出 json 报告
        });
    }
    catch (err) {
        console.log(err)
    }

}

export default {
    run
}
