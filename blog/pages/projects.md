---
title: Projects - Alomerry Wu
display: Projects
description: List of projects that I am proud of
plum: true
wrapperClass: 'text-center'
projects:
  Current Focus:
    - name: 'Nuxt Playground'
      link: 'https://github.com/nuxt/learn.nuxt.com'
      desc: 'Interactive Playground for learning Nuxt'
      icon: 'i-logos-nuxt-icon saturate-0'
    - name: 'Nuxt DevTools'
      link: 'https://github.com/nuxt/devtools'
      desc: 'Unleash Nuxt Developer Experience'
      icon: 'i-logos-nuxt-icon saturate-0'

  Golang Ecosystem:
    - name: 'go-pusher'
      link: 'https://github.com/alomerry/go-pusher'
      desc: 'Collection of Composition API utils for Vue 2 and 3'
      icon: 'vueuse'
    - name: 'copier'
      link: 'https://github.com/alomerry/copier'
      desc: 'Creates Universal Library for Vue 2 & 3'
      icon: 'vue-demi'
    - name: 'vue-template-promise'
      link: 'https://github.com/antfu/vue-template-promise'
      desc: 'Template as Promise in Vue'
      icon: 'i-carbon-cics-region-routing'
---

<!-- @layout-full-width -->

<ListProjects :projects="frontmatter.projects" />
