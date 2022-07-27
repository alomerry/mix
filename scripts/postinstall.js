var fs = require('fs');

copyFileSync('./patches/vuepress-theme-gungnir/lib/client/components/ArticleHeader.vue', './node_modules/vuepress-theme-gungnir/lib/client/components/ArticleHeader.vue');

copyFileSync('./patches/vuepress-theme-gungnir/lib/client/components/PostListItem.vue', './node_modules/vuepress-theme-gungnir/lib/client/components/PostListItem.vue');

copyFileSync('./patches/vuepress-theme-gungnir/lib/client/config.js', './node_modules/vuepress-theme-gungnir/lib/client/config.js');

copyFileSync('./patches/vuepress-theme-gungnir/lib/client/composables/index.js', './node_modules/vuepress-theme-gungnir/lib/client/composables/index.js');

copyFileSync('./patches/vuepress-theme-gungnir/lib/client/composables/useDynamicStyles.js', './node_modules/vuepress-theme-gungnir/lib/client/composables/useDynamicStyles.js');

copyFileSync('./patches/vuepress-theme-gungnir/lib/client/styles/mode/light.scss', './node_modules/vuepress-theme-gungnir/lib/client/styles/mode/light.scss');

copyFileSync('./patches/vuepress-theme-gungnir/lib/client/composables/useTags.js', './node_modules/vuepress-theme-gungnir/lib/client/composables/useTags.js');

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