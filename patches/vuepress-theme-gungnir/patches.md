# Patch 

## 导入 oh-vue-icon

```diff
--- lib/client/config.js
+++ lib/client/config.js
- import { BiLayoutSidebarInset, FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp, FaCircle, FaEnvelope, FaFacebookF, FaGithubAlt, FaLinkedinIn, FaListUl, FaMagic, FaMoon, FaPencilAlt, FaRegularCalendar, MdCreatenewfolderOutlined, FaRegularUser, FaSun, FaTwitter, HiTranslate, RiRssFill, RiSearch2Line, RiTimerLine, RiWeiboFill, RiZhihuLine } from "oh-vue-icons/icons";
+ import { BiLayoutSidebarInset, FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp, FaCircle, FaEnvelope, FaFacebookF, FaGithubAlt, FaLinkedinIn, FaListUl, FaMagic, FaMoon, FaPencilAlt, FaRegularCalendar, MdCreatenewfolderOutlined, FaRegularUser, FaSun, FaTwitter, HiTranslate, RiRssFill, RiSearch2Line, RiTimerLine, RiWeiboFill, RiZhihuLine } from "oh-vue-icons/icons";
import { h } from "vue";
import { Badge, CodeGroup, CodeGroupItem, LinkCard } from "./components/global";
import { setupBlogPages, setupDarkMode, setupDynamicStyle, setupSidebarItems, setupTagMap, useScrollPromise } from "./composables";
import "./styles/index.scss";
- addIcons(FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight, FaMagic, FaSun, FaMoon, FaGithubAlt, FaLinkedinIn, FaFacebookF, FaTwitter, RiZhihuLine, RiWeiboFill, FaEnvelope, RiRssFill, FaCircle, FaPencilAlt, FaRegularUser, FaRegularCalendar, RiTimerLine, FaListUl, BiLayoutSidebarInset, HiTranslate, RiSearch2Line);
+ addIcons(FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight, FaMagic, FaSun, FaMoon, FaGithubAlt, FaLinkedinIn, FaFacebookF, FaTwitter, RiZhihuLine, RiWeiboFill, FaEnvelope, RiRssFill, FaCircle, FaPencilAlt, FaRegularUser, FaRegularCalendar, MdCreatenewfolderOutlined, RiTimerLine, FaListUl, BiLayoutSidebarInset, HiTranslate, RiSearch2Line);
```

## 按 update 排序

`.vuepress/config.ts` 添加 `sortByUpdate: true`

- 添加 articleHeader
  ```diff
  <div v-if="frontmatter.date" class="article-icon">
  - <VIcon name="fa-regular-calendar" />
  + <VIcon name="md-createnewfolder-outlined" />
    <span>{{ formateDateString(frontmatter.date) }}</span>
  </div>
  + <div v-if="frontmatter.update" class="article-icon">
  +   <VIcon name="fa-regular-calendar" />
  +   <span>{{ formateDateString(frontmatter.update) }}</span>
  + </div>
  ```
- 按 update 的年做归类，并排序
  ```diff
  --- lib/client/utils/resolveBlogs.js
  +++ lib/client/utils/resolveBlogs.js
  - export const getPostsByYear = (posts) => {
  + export const getPostsByYear = (posts, sortByUpdate) => {
      const formatPages = {};
      const formatPagesArr = [];
      for (const post of posts) {
          if (!post.info.date)
              continue;
  -       const pageDateYear = resolveDate(post.info.date, "year");
  +       let date = post.info.date
  +       if (sortByUpdate && post.info.update) {
  +         date = post.info.update
  +       }
  +       const pageDateYear = resolveDate(date, "year");
          if (formatPages[pageDateYear])
              formatPages[pageDateYear].push(post);
          else
              formatPages[pageDateYear] = [post];
      }
      for (const key in formatPages) {
          formatPagesArr.unshift({
              year: key,
  -           data: formatPages[key]
  +           data: formatByType(formatPages[key], sortByUpdate)
          });
      }
      return formatPagesArr;
  };
  export const filterPostsByTag = (posts, tag) => tag === ""
      ? posts
      : posts.filter((item) => item.info.tags ? item.info.tags.includes(tag) : false);

  + const formatByType = (formatPages, sortByUpdate) => {
  +   if (sortByUpdate) {
  +     return formatPages.sort(function (a, b) {
  +       const timeA = getTime(a);
  +       const timeB = getTime(b);
  +       if (timeA === -1)
  +         return 1;
  +       if (timeB === -1)
  +         return -1;
  +       return timeB - timeA;
  +     })
  +   }
  +   return formatPages;
  + }
  + const getTime = (page) => {
  +   const date = page.info.update ? page.info.update : page.info.date;
  +   return date ? new Date(date).getTime() : -1;
  + };
  ```
- tags getPostsByYear 时传递 `config.sortByUpdate`
  ```diff
  --- lib/client/layouts/Tags.vue
  +++ --- lib/client/layouts/Tags.vue
  const tag =
      currentTag.value === themeLocale.value.showAllTagsText
        ? ""
        : currentTag.value;
  -   return getPostsByYear(filterPostsByTag(posts.value, tag));
  +   return getPostsByYear(filterPostsByTag(posts.value, tag), themeLocale.value.sortByUpdate);
  });
  ```
- lib/node/plugins/blog.js
  ```diff
  --- lib/node/plugins/blog.js
  +++ lib/node/plugins/blog.js
  getInfo: ({ excerpt, frontmatter }) => ({
    title: frontmatter.title || "",
    subtitle: frontmatter.subtitle || "",
    date: frontmatter.date || null,
  + update: frontmatter.update || null,
    tags: frontmatter.tags || [],
    headerImage: frontmatter.headerImage,
    excerpt
  }),
  ```
- 添加定义
  ```diff
  --- lib/shared/page.d.ts
  +++ lib/shared/page.d.ts
  export interface GungnirThemePostFrontmatter extends GungnirThemePageFrontmatter {
    title: string;
    subtitle?: string;
    editLink?: boolean;
    editLinkPattern?: string;
    lastUpdated?: boolean;
    useHeaderImage?: boolean;
    author?: string;
    date?: string;
  + update?: string;
    headerImage: string;
    headerMask?: string;
    headerImageCredit?: string;
    headerImageCreditLink?: string;
    catalog?: boolean;
    tags?: string[];
    hide?: boolean;
  }

  --- lib/shared/blog.d.ts
  +++ lib/shared/blog.d.ts
  export interface GungnirThemePostInfo extends Record<string, unknown> {
    title: string;
    subtitle?: string;
    date?: string | null;
  + update?: string | null;
    tags?: string[];
    headerImage: string;
    excerpt?: string;
    next?: GungnirThemePostPager | null;
    prev?: GungnirThemePostPager | null;
  }
  ```

## 随机图

- ArticleHeader
  ```diff
  --- lib/client/components/ArticleHeader.vue
  +++ lib/client/components/ArticleHeader.vue
  if (
    frontmatter.value.layout === "Post" &&
    frontmatter.value.useHeaderImage &&
    frontmatter.value.headerImage
  ) {
  - style.backgroundImage = `url(${withBase(frontmatter.value.headerImage)})`;
  + style.backgroundImage = `url(${withBase(triggerUri(frontmatter.value.headerImage))})`;
  }
  return style;

  + let lastIndex = 0;
  + function triggerUri(url) {
  +   if (typeof url === "string" && ((url || "").split("?")).length >= 2) {
  +     const cdn = (url || "").split("?")[0]
  +     const index = (url || "").split("?")[1].split("=")[1];
  +     const max = Math.floor(Math.random() * index + 1);
  +     if (lastIndex == 0) {
  +       lastIndex = max
  +     }
  +     return cdn + "/" + lastIndex + ".jpg";
  + }
  + return url;
  + }
  ```
- PostListItem
  ```diff
  --- lib/client/components/PostListItem.vue
  +++ lib/client/components/PostListItem.vue
  <div class="post-item__img" @click="$router.push(item.path)">
  -   <img :src="withBase(item.info.headerImage)" />
  +   <img :src="withBase(triggerUri(item.info.headerImage))" />
  </div>
  ...
  + let lastIndex = 0;
  + function triggerUri(url) {
  +   if (typeof url === "string" && ((url || "").split("?")).length >= 2) {
  +     const cdn = (url || "").split("?")[0]
  +     const index = (url || "").split("?")[1].split("=")[1];
  +     const max = Math.floor(Math.random() * index + 1);
  +     return cdn + "/" + max + ".jpg";
  +   }
  +   return url;
  + }
  ```

## 修改 tags 渐变范围

路径 `node_modules/vuepress-theme-gungnir/lib/client/composables/`

userTags.js

```js
export const useTags = (start = "#ff0000", end = "#ffb3b3") => {}
```

## Reference

- https://lwebapp.com/zh/post/pnpm-patch-package