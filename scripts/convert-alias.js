import fs from "fs";
import utils from "./utils.js"
import log from "./log.js";

// @IOI

function run() {
  let convertQueue = [];
  convertIOIAlias2Link(convertQueue)
  // Promise.all(convertQueue).then(res => {
  //   console.log(log.SuccessBg("convert cdn/ioi alias complete."))
  // })
}

// 将 [code](@IOI/xxx.go) => [code](<<< @/algorithm/leet-code/xxx.go)
function convertIOIAlias2Link(convertQueue) {
  const IOIDir = [
    "./ioi",
    "./zh/ioi"
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

export default {
  run
}

function convertIOIAlias(markdownPath) {
  let mdContent = fs.readFileSync(markdownPath, 'utf8');
  if (mdContent.match(/@IOI/) != null) {
    let category = getLeetCodeCategoryByPath(markdownPath);
    console.log(`${log.File(markdownPath)}`)
    if (category) {
      let res = "<<< @/algorithm/code/"+category;
      console.log(`  ${log.Success("convert done")}: ${log.Blue("@IOI")} => ${log.Path(res)}`)
      mdContent = mdContent.replace("@IOI", res)
      console.log(mdContent)
      // fs.writeFileSync(markdownPath, mdContent, 'utf8')
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
