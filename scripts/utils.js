import fs from "fs"
import { createHash } from 'node:crypto'
import path from "path"
import { resolve } from 'path';

// 获取路径里的全部文件相对地址
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

// 获取当前目录的全部文件地址
function getDirFilesPath(dirPath) {
  let allFilePaths = [];
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    for (let i = 0; i < files.length; i++) {
      let file = files[i]; // 文件名称（不包含文件路径）
      let currentFilePath = dirPath + '/' + file;
      let stats = fs.lstatSync(currentFilePath);
      if (stats.isDirectory()) {
        // empty
      } else {
        allFilePaths.push(currentFilePath);
      }
    }
  } else {
    // console.warn(`指定的目录${dirPath}不存在！`);
  }
  return allFilePaths;
}

// 获取路径里的全部目录相对地址
function getAllDirPath(filePath) {
  let allFilePaths = [];
  if (fs.existsSync(filePath)) {
    const files = fs.readdirSync(filePath);
    for (let i = 0; i < files.length; i++) {
      let file = files[i]; // 文件名称（不包含文件路径）
      let currentFilePath = filePath + '/' + file;
      let stats = fs.lstatSync(currentFilePath);
      if (stats.isDirectory()) {
        allFilePaths.push(currentFilePath);
        allFilePaths = allFilePaths.concat(getAllDirPath(currentFilePath));
      }
    }
  } else {
    // console.warn(`指定的目录${filePath}不存在！`);
  }
  return allFilePaths;
}

// 获取文件所在目录
function getFileDir(filePath) {
  if (fs.existsSync(filePath)) {
    return path.parse(filePath).dir;;
  } else {
    console.warn(`文件【${filePath}】不存在！`);
    return undefined;
  }
}

// 获取下级目录列表
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

/**
* 获取文件返回到根目录的前缀。
*
* @param {string} filePath - 待分析的文件路径
* @returns {string} 前缀字符串
*/
function GetReturnRootPrefix(filePath) {
  let path = getFileDir(filePath)
  let prefix = "";
  let pathArr = path.split("/");
  for (let i = pathArr.length -1; i >= 0; i--) {
    if (pathArr[i] === ".") {
      break;
    }
    prefix += "../";
  }
  return prefix;
}

function getFileType(filePath) {
  if (fs.existsSync(filePath)) {
    let stats = fs.lstatSync(filePath);
    if (!stats.isDirectory()) {
      return filePath.substring(filePath.lastIndexOf(".") + 1, filePath.length)
    }
  }
  return null
}

function getFileName(filePath) {
  if (fs.existsSync(filePath)) {
    let stats = fs.lstatSync(filePath);
    if (!stats.isDirectory()) {
      return filePath.substring(filePath.lastIndexOf("/") + 1, filePath.length)
    }
  }
  return null
}

function existsPath(filePath) {
  if (fs.existsSync(filePath)) {
    return true
  }
  return false
}

function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
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

function getMD5(filePath) {
  return createHash('md5').update(fs.readFileSync(filePath, 'utf8')).digest('hex')
}

function checkMD5(sourcePath, targetPath) {
  if (!fs.existsSync(sourcePath)) {
    return false
  }

  if (!fs.existsSync(targetPath)) {
    return false
  }
  return getMD5(sourcePath) == getMD5(targetPath)
}

// need delete
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

// 路径是否存在，不存在则创建
function mkdirRecursions(dir) {
  //如果该路径且不是文件，返回true
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    return true
  }
  else if (fs.existsSync(dir)) {
    return false;
  }
  // 如果该路径不存在，拿到上级路径
  let tempDir = path.parse(dir).dir;
  console.log(tempDir)
  // 递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  let status = mkdirRecursions(tempDir);
  let mkdirStatus;
  if (status) {
    mkdirStatus = fs.mkdirSync(dir);
  }
  return mkdirStatus;
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

function getAbsoluteIOIPath() {
  return resolve('./ioi/');
}

// 仅拷贝文件
function copy(from, to) {
  if (fs.existsSync(from)) {
    // console.log(`from [${from}] to [${to}]`)
    let input = fs.createReadStream(from)

    // 上层文件夹不存在则创建
    let dir = path.parse(to).dir
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }, function (err, path) {
        if (err != null) {
          console.error(err)
        }
      })
    }

    let output = fs.createWriteStream(to)
    // https://www.runoob.com/nodejs/nodejs-stream.html
    input.pipe(output)
  }
}

// 获取目录下所有文件文件名，并组合成数组
function tools_IOI_SiderBar_Children_Generator(path, prefix) {
  var mapper = new Map();
  var indexSet = new Set()
  var str = ""
  getDirFilesPath(path).forEach(function (filePath) {
    var sidebarItem = filePath.replace(prefix, "")
    var indexes = sidebarItem.split("-")
    if (indexes.length >= 1) {
      indexSet.add(parseInt(indexes[0]))
      mapper.set(parseInt(indexes[0]), sidebarItem)
    }
  })
  Array.from(indexSet).sort((a, b) => a - b).forEach(function (index) {
    if (str != "") {
      str += "\n"
    }
    str += `      '${mapper.get(index)}',`
  })
  return str
}

export default {
  GetReturnRootPrefix,

  getAllFilesPath, getDirFilesPath, getFileDir, getAllDirPath, getChildDir, deleteFile, deleteDir, clearDir, existsPath, makeDir, getFileType, getFileName, copy, getMD5, checkMD5,


  tools_IOI_SiderBar_Children_Generator, getAbsoluteIOIPath,
}
