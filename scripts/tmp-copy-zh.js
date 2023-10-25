import fs from "fs";
import constant from "./constant.js";

const RootLang = "en" // TODO: translate zh-cn to en, after translate success

const LANGS = [
  "zh",
]

function run() {
  constant.CATEGORIES.forEach(category => {
    LANGS.forEach(lang => {
      copyCategoryToLang(category, lang);
    });
  });
  console.log("setup i18n success.");
}

function copyCategoryToLang(category, lang) {
  fs.cp(`./src/${category}`, `./src/${lang}/${category}`, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

export default {
  run
}