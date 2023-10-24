import fs from "fs";
const RootLang = "en" // TODO: translate zh-cn to en, after translate success

const CATEGORIES = [
  "8gu"
]

const LANGS = [
  "zh",
]

function run() {
  CATEGORIES.forEach(category => {
    LANGS.forEach(lang => {
      copyCategoryToLang(category, lang);
    });
  });
  console.log("setup i18n success.");
}

function copyCategoryToLang(category, lang) {
  fs.cp(`./${category}`, `./${lang}/${category}`, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

export default {
  run
}