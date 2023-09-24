// 导入 .assets 中文件时仅需 ![xxx](@CDN/fileName) 即可，本脚本会解析并修改到对应目录
import fs from "fs";
import utils from "./utils.js"
import constant from "./constant.js";

// TODO 检查 public 下的 assets 能否对应文章目录下的 assets

function run() {
  convertCDNAlias2URL()
}

// 将 markdown 中的 @CDN 替换成 url
function convertCDNAlias2URL() {
  let convertQueue = []
  constant.MD_DIR_LIST.forEach(function (mdPath) {
    let p = new Promise((resolve, reject) => {
      copySourceFile(mdPath)
      resolve();
    })
    convertQueue.push(p)
  })
  Promise.all(convertQueue).then(res => {
    console.log("convert cdn alias complete")
  })
}

function copySourceFile(mdPath) {
  let sonsDirPath = utils.getAllDirPath(mdPath)
  let dirQueue = [];
  sonsDirPath.forEach(dirPath => {
    if (dirPath.endsWith("/assets")) {
      // ./src/posts/assets/xxx.png => ./src/.vuepress/public/assets/img/posts/xxx.png
      // ./src/posts/assets/xxx.mp3 => ./src/.vuepress/public/assets/audio/posts/xxx.mp3
      // ./src/posts/assets/xxx.mp4 => ./src/.vuepress/public/assets/vedio/posts/xxx.mp4
      let p = new Promise((resolve, reject) => {
        if (utils.getChildDir(dirPath).length > 0) {
          console.error(`${dirPath} can't contains sub dir`)
          return
        }

        let fileName2BelongMap = new Map()
        utils.getAllFilesPath(dirPath).forEach(function (assetPath) {
          fileName2BelongMap.set(utils.getFileName(assetPath), getFileBelongByType(utils.getFileType(assetPath)))
          let toPath = getOutputFilePath(assetPath)
          if (!toPath) {
            console.error(`${assetPath} copy to public dir failed`)
            return
          }
          // TODO md5 判断是否发生变化，没变化就不 copy 了
          if (!utils.checkMD5(assetPath, toPath)) {
            utils.copy(assetPath, toPath)
          } else {
            // console.log(`${utils.getFileName(assetPath)} not change.`)
          }
        })
        utils.getDirFilesPath(dirPath + "/..").forEach(function (markdownPath) {
          replaceCDN(markdownPath, fileName2BelongMap)
        })
        resolve();
      })
      dirQueue.push(p)
    }
  });
  Promise.all(dirQueue).then(res => { })
}

function getOutputFilePath(fromPath) {
  let belongTo = getFileBelongByType(utils.getFileType(fromPath))
  if (belongTo == null) {
    return null
  }
  let mdPrefix = getOutputFilePrefix(fromPath)
  let fileName = utils.getFileName(fromPath)

  let toPath = [constant.ASSETS_PATH, belongTo, mdPrefix, fileName].join("/")
  return toPath
}

// 获取文件相对 src 的相对路径
function getOutputFilePrefix(fromPath) {
  let mdPrefix = fromPath.replace("./src/", "")
  if (fromPath.lastIndexOf("/assets/") > 0) {
    mdPrefix = mdPrefix.substring(0, mdPrefix.lastIndexOf("/assets"))
  }
  if (fromPath.lastIndexOf(".md") > 0) {
    mdPrefix = mdPrefix.replace(/\/[\w]*.md/g, "")
  }

  return mdPrefix
}

function getFileBelongByType(fileType) {
  if (!constant.FileTypeBelongToMapper.has(fileType)) {
    console.error(`unsupport file type [${fileType}]`)
    return null
  }

  return constant.FileTypeBelongToMapper.get(fileType)
}

function replaceCDN(markdownPath, fileName2BelongMap) {
  let mdContent = fs.readFileSync(markdownPath, 'utf8');
  fileName2BelongMap.forEach(function (belongTo, fileName) {
    if (mdContent.match("@CDN/" + fileName) != null) {
      let url = constant.CDN_BLOG_URL + "/assets/" + belongTo + "/" + getOutputFilePrefix(markdownPath) + "/" + fileName
      mdContent = mdContent.replace("@CDN/" + fileName, url)
      fs.writeFileSync(markdownPath, mdContent, 'utf8')
    } else if (mdContent.match("@CDN/") != null){
      console.log(markdownPath, " not found resources")
    }
  })
}

export default {
  run
}
