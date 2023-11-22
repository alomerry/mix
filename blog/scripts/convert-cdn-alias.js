// 导入 .assets 中文件时仅需 ![xxx](@CDN/fileName) 即可，本脚本会解析并修改到对应目录
import fs from "fs";
import utils from "./utils.js"
import constant from "./constant.js";
import log from "./log.js";

// @CDN
// @IOI

// TODO 检查 public 下的 assets 能否对应文章目录下的 assets
function run() {
  let convertQueue = [];
  convertCDNAlias2URL(convertQueue)
  convertIOIAlias2Link(convertQueue)
  Promise.all(convertQueue).then(res => {
    console.log(log.SuccessBg("convert cdn/ioi alias complete."))
  })
}

// 将 markdown 中的 @CDN 替换成 url
function convertCDNAlias2URL(convertQueue) {
  constant.MD_DIR_LIST.forEach(function (mdPath) {
    let p = new Promise((resolve, reject) => {
      copySourceFile(mdPath)
      resolve();
    })
    convertQueue.push(p)
  })
}

// 将 [code](@IOI/xxx.go) => [code](../algorithm/leet-code/xxx.go)
function convertIOIAlias2Link(convertQueue) {
  const IOIDir = [
    "./src/posts/ioi",
    "./src/zh/posts/ioi"
  ];
  IOIDir.forEach((ioiDir) => {
    let dirPaths = utils.getAllDirPath(ioiDir) // 获取 ioi 下的所有子目录
    dirPaths.forEach(dirPath => {
      if (dirPath.indexOf("leetcode") !== -1) {
        utils.getDirFilesPath(dirPath).forEach((markdownPath) => {
          let p = new Promise((resolve, reject) => {
            convertIOIAlias(markdownPath);
            resolve();
          })
          convertQueue.push(p)
        })
      }
    })
  })
}

// 将 @CDN 的文件复制到 public 目录下，并替换 markdown 中的 @CDN/fileName 为 url，后续需要执行 pnpm oss 上传到 oss 中
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
            console.log(`${utils.getFileName(assetPath)} not change.`)
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
    } else if (mdContent.match("@CDN/") != null) {
      console.log(`  ${log.Error(" not found resources")}`)
    }
  })
}

export default {
  run
}

function convertIOIAlias(markdownPath) {
  let mdContent = fs.readFileSync(markdownPath, 'utf8');
  if (mdContent.match(/@\[code\]\(@IOI/) != null) {
    let category = getLeetCodeCategoryByPath(markdownPath);
    let rootPrefix = utils.GetReturnRootPrefix(markdownPath);
    console.log(`${log.File(markdownPath)}`)
    if (category && rootPrefix) {
      let res = rootPrefix+"algorithm/code/"+category;
      console.log(`  ${log.Success("convert done")}: ${log.Blue("@IOI")} => ${log.Path(res)}`)
      mdContent = mdContent.replace("@IOI", res)
      fs.writeFileSync(markdownPath, mdContent, 'utf8')
    } else {
      console.log(`  ${log.Error("unsupported category: "+ category)}`)
    }
  }
}

// 获取 leetcode 分类（easy/medium/hard/sql/weekly）
function getLeetCodeCategoryByPath(markdownPath) {
  let res = "";
  new Map([
    ['easy', "leet-code/easy"],
    ['medium', "leet-code/medium"],
    ['hard', "leet-code/hard"],
    ['sql', "leet-code-sql"],
    ['weekly', "leet-code-weekly"],
  ]).forEach((path, category)=>{
    if (markdownPath.indexOf(category) !== -1) {
      res = path;
    }
  });

  return res;
}
