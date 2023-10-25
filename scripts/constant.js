
const CDN_BLOG_URL = "https://cdn.alomerry.com/blog"
// .vuepress 配置相对路径
const VUEPRESS_PATH = "./src/.vuepress"
// 原始字体文件相对路径
const ORIGIN_FONT_PATH = "./src/.vuepress/public/assets/fonts"

const ASSETS_PATH = "./src/.vuepress/public/assets"

const PUBLIC_PATH = "./src/.vuepress/public"

const CATEGORIES = [
  "about",
  "links",
  "notes",
  "posts",
  "projects",
]

let MD_DIR_LIST = CATEGORIES.map(category => `./src/${category}`)

const FileTypeBelongToMapper = new Map([
  ["png", "img"], ["gif", "img"], ["jpg", "img"], ["jpeg", "img"], ["svg", "img"], ["webp", "img"],
  ["pdf", "pdf"],
  ["mp3", "audio"],
  ["md", "markdown"],
])

export default {
  CDN_BLOG_URL, ORIGIN_FONT_PATH, VUEPRESS_PATH, MD_DIR_LIST, CATEGORIES, ASSETS_PATH, PUBLIC_PATH, FileTypeBelongToMapper
}