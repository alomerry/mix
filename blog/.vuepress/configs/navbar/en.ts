import type {NavbarConfig} from "vuepress-theme-gungnir";

export const en: NavbarConfig = [
    {text: "Home", link: "/", icon: "fa-fort-awesome"},
    {text: "Tags", link: "/tags/", icon: "fa-tag"},
    {text: "Links", link: "/links/", icon: "fa-satellite-dish"},
    {text: "IOI", link: "https://io.alomerry.com", icon: "bi-diamond-half"},
    {
        text: `Space`,
        icon: "co-spacemacs",
        children: [
            {text: "digest", link: "/posts/2019-07-02-digest.md", icon: "bi-book-half"},
            {text: "todo", link: "/posts/2022-09-17-todo.md", icon: "vi-file-type-light-todo"},
            {text: "algorithm", link: "/posts/2022-09-26-algorithm-[note].md", icon: "ci-algo"},
            {text: "vps-backup", link: "/posts/2022-05-29-vps-home.md", icon: "vi-file-type-git"},
        ]
    },
    {
        text: `Notes`,
        icon: "bi-bookmark-heart-fill",
        children: [
            {text: "redis", link: "/posts/2020-07-06-redis-[note].md", icon: "vi-folder-type-redis"},
            {text: "git", link: "/posts/2020-07-06-git-[note].md", icon: "vi-file-type-git"},
            {text: "html", link: "/posts/2020-07-06-html-[note].md", icon: "vi-file-type-html"},
            {text: "nodejs", link: "/posts/2020-07-11-nodejs-[note].md", icon: "io-logo-nodejs"},
            {text: "golang", link: "/posts/2020-08-10-golang-[note].md", icon: "vi-file-type-go"},
            {text: "mongodb", link: "/posts/2021-05-22-mongodb-[note].md", icon: "vi-folder-type-mongodb"},
            {text: "nginx", link: "/posts/2022-02-26-nginx-[note].md", icon: "vi-file-type-nginx"},
            {text: "docker", link: "/posts/2022-04-27-docker-[note].md", icon: "vi-file-type-docker2"},
        ]
    },
    {
        text: `Tools`,
        icon: "fa-tools",
        children: [
            {
                text: "golang",
                icon: "bi-hypnotize",
                children: [
                    {text: "grpc", link: "/posts/2021-06-23-grpc-[note].md", icon: "si-aiohttp"},
                    {text: "gin", link: "/posts/2022-04-29-gin-[note].md", icon: "si-coronaengine"},
                ]
            },
            {
                text: "message queue",
                children: [
                    {text: "rocketmq", link: "/posts/2021-06-23-grpc-[note].md", icon: "ri-message-3-fill"},
                ]
            },
            {
                text: "CI/CD",
                children: [
                    {text: "jenkins", link: "/posts/2022-06-23-jenkins-[note].md", icon: "vi-file-type-jenkins"},
                ]
            }
        ]
    },
    {
        text: `Books`,
        icon: "ri-contacts-book-2-fill",
        children: [
            {text: "clean code", link: "/posts/2020-10-03-clean-code-[book].md", icon: "ri-book-2-fill"},
            {
                text: "go programming language",
                link: "/posts/2021-03-01-go-programming-language-[book].md",
                icon: "ri-book-read-fill"
            },
            {text: "go design", link: "/posts/2022-02-14-go-design-[book].md", icon: "ri-booklet-fill"},
            {text: "gopl", link: "/posts/2022-02-14-gopl-[book].md", icon: "ri-book-open-fill"}
        ]
    }
];
