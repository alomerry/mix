import fs from "fs"
import path from "path"
import request from "request"

run()

function run() {
    //  downloadUrlCode()
}

function downloadUrlCode() {
    // 导入代码块
    let importCodePrefix = "./blog/posts/codes/";
    let projects = JSON.parse(readJsonFromFile('./scripts/import-code.json')).projects;

    let downloadQueue = [];

    projects.forEach(function (project) {
        let projectName = project.name;
        removeDir(importCodePrefix + projectName)
        let files = project[project.name]
        files.forEach(function (code) {
            let p = new Promise((resolve, reject) => {
                getfileByUrl(code.url, importCodePrefix + projectName + "/" + code.relativeLocation, code.fileName)
                resolve();
            })
            downloadQueue.push(p)
        })
    })
    // 等待所有文件下载完毕
    Promise.all(downloadQueue).then(res => {
        console.info('import codes download success.');
    })
}

function readJsonFromFile(file) {
    try {
        const data = fs.readFileSync(file, 'utf8')
        return data
    } catch (err) {
        console.error(err)
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

function getfileByUrl(url, dir, fileName) {
    makeDir(dir)
    let stream = fs.createWriteStream(path.join(dir, fileName));
    request(url).pipe(stream).on("close", function (err) {
        if (err) {
            console.log(err);
        }
    });
}
