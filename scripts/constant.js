
const CDN_BLOG_URL = "https://cdn.alomerry.com/blog"
// .vuepress 配置相对路径
const VUEPRESS_PATH = "./src/.vuepress"
// 原始字体文件相对路径
const ORIGIN_FONT_PATH = "./src/.vuepress/public/assets/fonts"

const ASSETS_PATH = "./src/.vuepress/public/assets"

const PUBLIC_PATH = "./src/.vuepress/public"

let MD_DIR_LIST = [
  "./src/about",
  "./src/books",
  "./src/ioi",
  "./src/links",
  "./src/notes",
  "./src/posts",
  "./src/projects",
  "./src/space",
  "./src/tools",
]

const FileTypeBelongToMapper = new Map([
  ["png", "img"], ["gif", "img"], ["jpg", "img"], ["jpeg", "img"], ["svg", "img"], ["webp", "img"],
  ["pdf", "pdf"],
  ["mp3", "audio"],
  ["md", "markdown"],
])

export default {
  CDN_BLOG_URL, ORIGIN_FONT_PATH, VUEPRESS_PATH, MD_DIR_LIST, ASSETS_PATH, PUBLIC_PATH, FileTypeBelongToMapper
}