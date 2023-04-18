import fs from "fs"
import path from "path"

function getAllFilesPath(filePath) {
  let allFilePaths = [];
  if (fs.existsSync(filePath)) {
    const files = fs.readdirSync(filePath);
    for (let i = 0; i < files.length; i++) {
      let file = files[i]; // 文件名称（不包含文件路径）
      let currentFilePath = filePath + '/' + file;
      let stats = fs.lstatSync(currentFilePath);
      if (stats.isDirectory()) {
        allFilePaths = allFilePaths.concat(getAllFilesPath(currentFilePath));
      } else {
        allFilePaths.push(currentFilePath);
      }
    }
  } else {
    // console.warn(`指定的目录${filePath}不存在！`);
  }
  return allFilePaths;
}

function getChildDir(filePath) {
  let allChildDirPaths = [];
  if (fs.existsSync(filePath)) {
    const files = fs.readdirSync(filePath);
    for (let i = 0; i < files.length; i++) {
      let file = files[i]; // 文件名称（不包含文件路径）
      let currentFilePath = filePath + '/' + file;
      let stats = fs.lstatSync(currentFilePath);
      if (stats.isDirectory()) {
        allChildDirPaths.push(currentFilePath);
      }
    }
  } else {
    console.error(`指定的目录 ${filePath} 不存在！`);
  }
  return allChildDirPaths;
}

function existsPath(filePath) {
  if (fs.existsSync(filePath)) {
    return true
  }
  return false
}

function deleteDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    var filesPath = getAllFilesPath(dirPath)
    filesPath.forEach(filePath => {
      fs.unlink(filePath, function (err) {
        if (err) {
          return console.error(err);
        }
      });
    });
    fs.rmdir(dirPath, function (err) {
      if (err) {
        return console.error(err);
      }
    });
  }
}

function clearDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    var filesPath = getAllFilesPath(dirPath)
    filesPath.forEach(filePath => {
      fs.unlink(filePath, function (err) {
        if (err) {
          return console.error(err);
        }
      });
    });
  } else {
    fs.mkdir(dirPath, function (err) {
      if (err) {
        return console.error(err);
      }
    });
  }
}

function makeDir(dirpath) {
  if (!fs.existsSync(dirpath)) {
    var pathtmp;
    dirpath.split("/").forEach(function (dirname) {
      if (pathtmp) {
        pathtmp = path.join(pathtmp, dirname);
      } else {
        if (dirname) {
          pathtmp = dirname;
        } else {
          pathtmp = "/";
        }
      }
      if (!fs.existsSync(pathtmp)) {
        if (!fs.mkdirSync(pathtmp)) {
          return false;
        }
      }
    });
  }
  return true;
}

function removeDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i]);
    let stat = fs.statSync(newPath)
    if (stat.isDirectory()) {
      //如果是文件夹就递归下去
      removeDir(newPath);
    } else {
      //删除文件
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉
}

export default {
  getAllFilesPath, getChildDir, existsPath, deleteDir, clearDir, existsPath, makeDir
}
