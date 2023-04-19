import fs from "fs";
import utils from "./utils.js"
import constant from "./constant.js";

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
    console.log("convert cdn alias success")
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
          utils.copy(assetPath, toPath)
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
  switch (fileType) {
    case "png" || "jpg" || "jpeg":
      return "img"
    case "mp3":
      return "audio"
    case "pdf":
      return "pdf"
    case "md":
      return "markdown"
    default: return null
  }
}

function replaceCDN(markdownPath, fileName2BelongMap) {
  let mdContent = fs.readFileSync(markdownPath, 'utf8');
  fileName2BelongMap.forEach(function (belongTo, fileName) {
    if (mdContent.match("@CDN/" + fileName) != null) {
      let url = constant.CDN_BLOG_URL + "/assets/" + belongTo + "/" + getOutputFilePrefix(markdownPath) + "/" + fileName
      mdContent = mdContent.replace("@CDN/" + fileName, url)
      fs.writeFileSync(markdownPath, mdContent, 'utf8')
    }
  })
}

export default {
  run
}