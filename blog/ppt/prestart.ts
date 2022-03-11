require("dotenv").config();
const package = require('./package.json');
const path = require("path");
const fs = require('fs');

let MARKDOWN_SOURCE_FILE = 'nodeppt build';
let pathName = __dirname;

fs.readdir(pathName, function (err, files) {
  (function iterator(i) {
    if (i == files.length) {
      package.scripts["start"] = MARKDOWN_SOURCE_FILE
      package.name = process.env.NAME
      fs.writeFileSync('package.json', JSON.stringify(package, null, 4));
      return;
    }
    fs.stat(path.join(pathName, files[i]), function (err, data) {
      if (data.isFile() && files[i].indexOf(".md") != -1 && files[i] != "README.md") {
        MARKDOWN_SOURCE_FILE += (" " + files[i]);
      }
      iterator(i + 1);
    });
  })(0);
});

// todo 执行多次 build，不然每次 build 只 build 第一个


