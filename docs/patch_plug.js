// npm install request --save

var fs = require("fs");
var path = require("path");

run()

function run() {
    patchJekyllIncludePlug()
}

function patchJekyllIncludePlug() {
    copyFileSync('./_patches/bundle/ruby/gems/jekyll_include_plugin/lib/jekyll_include_plugin/jekyll_include_plugin.rb', './vendor/bundle/ruby/3.1.0/gems/jekyll_include_plugin-1.1.0/lib/jekyll_include_plugin/jekyll_include_plugin.rb');
}

function copyFileSync(source, target) {
    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}