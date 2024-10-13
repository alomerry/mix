---
title: Streams - Alomerry Wu
display: ''
art: plum
items:
  - title: 'xxxx'
    date: '2022-07-08'
    path: 'https://www.bilibili.com/video/xxxx'
    platform: Bilibili
    lang: 'zh'
  - title: "xxxx"
    date: '2023-11-21'
    path: 'https://www.youtube.com/watch?v=xxxx'
    platform: YouTube
    lang: 'en'
---

<SubNav />

<div slide-enter>

<div i-ri:vidicon-2-line mr2 />
<span op50>Live streaming at <a href="https://www.youtube.com/xxx" target="_blank">YouTube</a> & <a href="https://space.bilibili.com/xxx" target="_blank">哔哩哔哩</a></span>

</div>

<!-- <StreamAnnouncement /> -->

<ListPosts :posts="frontmatter.items.reverse()" />
