import fs from "fs";

const CDN_BLOG_URL = "https://cdn.alomerry.com/blog"
const CDN_BLOG_HEADER_URL = "https://cdn.alomerry.com/blog/img/in-post/header-image?max="
const CDN_BLOG_HEADER_IMAGE_COUNT = 64

run()

function run() {
    console.log("prepare")
    convertCDNAlias2URL()
}

// 将 markdown 中的 @CDN 替换成 url
function convertCDNAlias2URL() {
    // 遍历文件夹
    // 依次读取 md
    // 按行读取 @CDN 并替换
    getAllFiles("./blog/posts");
    getAllFiles("./blog/links");
}

function getAllFiles(filePath) {
    let allFilePaths = [];
    if (fs.existsSync(filePath)) {
        const files = fs.readdirSync(filePath);
        for (let i = 0; i < files.length; i++) {
            let file = files[i]; // 文件名称（不包含文件路径）
            let currentFilePath = filePath + '/' + file;
            let stats = fs.lstatSync(currentFilePath);
            if (stats.isDirectory()) {
                allFilePaths = allFilePaths.concat(getAllFiles(currentFilePath));
            } else {
                let needCheckCDN = currentFilePath.endsWith(".md");
                if (needCheckCDN) {
                    replaceCDN(currentFilePath);
                }
                allFilePaths.push(currentFilePath);
            }
        }
    } else {
        // console.warn(`指定的目录${filePath}不存在！`);
    }
    return allFilePaths;
}

function replaceCDN(markdownPath) {
    let mdContent = fs.readFileSync(markdownPath, 'utf8');

    // 替换 max 为最新数字
    mdContent = mdContent.replace(/https:\/\/cdn.alomerry.com\/blog\/img\/in-post\/header-image\?max=[0-9]+/gm, CDN_BLOG_HEADER_URL + CDN_BLOG_HEADER_IMAGE_COUNT)
    // 替换 @CDN-Header
    mdContent = mdContent.replace(/@CDN-Header/gm, CDN_BLOG_HEADER_URL + CDN_BLOG_HEADER_IMAGE_COUNT)
    // 替换 @CDN
    mdContent = mdContent.replace(/@CDN/gm, CDN_BLOG_URL)
    fs.writeFileSync(markdownPath, mdContent, 'utf8')
}