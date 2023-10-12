import fs from "fs";
import utils from "./utils.js";
import constant from "./constant.js";
import request from "request";

function run() {
  downloadGithubYearlyControbution();
  // 导入 gitee 代码
  downloadFromGitee();
}

// 下载 github 瓷砖图 https://github.com/alomerry/github-yearly-contributions
function downloadGithubYearlyControbution() {
  let tmp = fs.createWriteStream(
    constant.PUBLIC_PATH + "/github-contribution-grid-snake.svg"
  );
  let svg =
    "https://gitee.com/alomerry/github-yearly-contributions/raw/output/github-contribution-grid-snake.svg";
  request(svg)
    .pipe(tmp)
    .on("close", function (err) {
      if (err) {
        console.log("download github yearly contributions svg failed.");
      }
    });
}

function downloadFromGitee() {
  removeLastFailedDownload();
  let downloadQueue = [];
  // 遍历所有 markdown 目录
  constant.MD_DIR_LIST.forEach(function (blogDir) {
    var mds = utils.getAllFilesPath(blogDir);
    mds.forEach(function (mdPath) {
      let mdContent = fs.readFileSync(mdPath, "utf8");
      let importFiles = mdContent.match(/@\[code[ ]?[\w]*:?[\w-]*\]\(@_codes(.*)\)/g);
      if (importFiles != null) {
        importFiles.forEach(function (relatePath) {
          let p = new Promise((resolve, reject) => {
            downloadImportFile(mdPath, relatePath)
            resolve();
          });
          downloadQueue.push(p)
        });
        replaceImportCodeBlockToRelate(mdPath);
      }
    });
  });
  // 等待所有文件下载完毕
  Promise.all(downloadQueue).then((res) => {
    console.info("import codes download completed");
    checkfile();
  });
}

// 将 @[code](@_codes/) 替换成 [code](../_codes/)
function replaceImportCodeBlockToRelate(mdPath) {
  let mdContent = fs.readFileSync(mdPath, "utf8");
  let relateDir = utils.getFileDir(mdPath);
  if (relateDir) {
    let count = relateDir.split("/").length - 2;
    let prefix = "";
    for (let i = 0; i < count; i++) {
      prefix += "../";
    }
    prefix += "_codes/";
    mdContent = mdContent.replace("(@_codes/", "(" + prefix);
    fs.writeFileSync(mdPath, mdContent, 'utf8')
  }
}

// 删除上次下载失败的文件
function removeLastFailedDownload() {
  let checkQueue = [];

  utils.getAllFilesPath("./src/_codes").forEach(function (filePath) {
    let p = new Promise((resolve, reject) => {
      let codeContent = fs.readFileSync(filePath, "utf8");
      if (codeContent.match(/Repository or file not found/g) != null) {
        utils.deleteFile(filePath);
      }
      resolve();
    });
    checkQueue.push(p);
  });

  Promise.all(checkQueue).then((res) => {
    console.info("clear last download completed");
  });
}

// 检查下载的文件是否正确
function checkfile() {
  let checkQueue = [];

  utils.getAllFilesPath("./src/_codes").forEach(function (filePath) {
    let p = new Promise((resolve, reject) => {
      let codeContent = fs.readFileSync(filePath, "utf8");
      if (codeContent.match(/Repository or file not found/g) != null) {
        console.log(`git not exists file: [${filePath}]`);
      }
      resolve();
    });
    checkQueue.push(p);
  });

  Promise.all(checkQueue).then((res) => {
    console.info("check codes completed");
  });
}

function getOutputFilePath(relatePath) {
  // '@[code yml:no-line-numbers](@_codes/vps-home/frpc/umami/docker-compose.yml)' => ../src/_codes/vps-home/frpc/umami/docker-compose.yml
  let outputFilePath = relatePath.replace(
    /@\[code[ ]?[\w]*:?[\w-]*\]\(@_codes\//gm,
    ""
  );
  outputFilePath =
    "./src/_codes/" +
    outputFilePath.substring(0, outputFilePath.lastIndexOf(")"));
  return outputFilePath;
}

function getOutputDir(relatePath) {
  // '@[code yml:no-line-numbers](@_codes/vps-home/frpc/umami/docker-compose.yml)' => vps-home/frpc/umami/
  let outputDir = relatePath.replace(
    /@\[code[ ]?[\w]*:?[\w-]*\]\(@_codes\//gm,
    ""
  );
  return outputDir.substring(0, outputDir.lastIndexOf("/"));
}

function needDownload(relatePath) {
  if (!relatePath.match(/@\[code[ ]?[\w]*:?[\w-]*\]\(@_codes\//gm)) {
    return false;
  }
  return true;
}

function prepareDownloadDir(relatePath) {
  let importCodePrefix = "./src/_codes/";
  if (!needDownload(relatePath)) {
    return false;
  }
  let outputDir = getOutputDir(relatePath);
  if (outputDir == null) {
    console.warn(`can't resolve file [${relatePath}]`);
    return false;
  }
  utils.makeDir(importCodePrefix + outputDir);
  return true;
}

function getUrlFileByBranch(relatePath, branch) {
  // '@[code yml:no-line-numbers](./codes/vps-home/README.md)' => https://gitee.com/alomerry/vps-home/raw/master/README.md
  let webUrl = relatePath.replace(
    /@\[code[ ]?[\w]*:?[\w-]*\]\(@_codes\//gm,
    ""
  );
  webUrl = webUrl.substring(0, webUrl.lastIndexOf(")"));
  let reponsitory = webUrl.split("/")[0];
  return (
    "https://gitee.com/alomerry/" +
    reponsitory +
    "/raw/" +
    branch +
    webUrl.replace(reponsitory, "")
  );
}

function downloadImportFile(mdPath, relatePath) {
  var prepreSuccess = prepareDownloadDir(relatePath);
  if (prepreSuccess) {
    let develop = getUrlFileByBranch(mdPath, relatePath, "develop");
    let master = getUrlFileByBranch(relatePath, "master");
    let outputFilePath = getOutputFilePath(relatePath);
    if (outputFilePath == null) {
      console.log(`file: [${relatePath}] output file path not exists`);
      return;
    }
    let stream = fs.createWriteStream(outputFilePath);
    request(master)
      .pipe(stream)
      .on("close", function (err) {
        if (err) {
          let tmp = fs.createWriteStream(outputFilePath);
          request(develop)
            .pipe(tmp)
            .on("close", function (err) {
              if (err) {
                console.log("download ${relatePath} failed.");
              }
            });
        }
      });
  }
}

export default {
  run,
};
