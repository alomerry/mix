---
layout: page
---

### Title <Badge type="info" text="default" /> 
### Title <Badge type="tip" text="^1.9.0" /> 
### Title <Badge type="warning" text="beta" />
### Title <Badge type="danger" text="caution" />

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme'

const coreMembers = [
  {
    avatar: 'https://cdn.alomerry.com/blog/avatar.png',
    name: 'Alomerry Wu',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/alomerry' },
      { icon: 'twitter', link: 'https://twitter.com/alomerry' }
    ]
  },
  {
    avatar: 'https://cdn.alomerry.com/blog/avatar.png',
    name: 'Alomerry Wu',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/alomerry' },
      { icon: 'twitter', link: 'https://twitter.com/alomerry' }
    ]
  },
]
const partners = [
  {
    avatar: 'https://cdn.alomerry.com/blog/avatar.png',
    name: 'Alomerry Wu',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/alomerry' },
      { icon: 'twitter', link: 'https://twitter.com/alomerry' }
    ]
  },
  {
    avatar: 'https://cdn.alomerry.com/blog/avatar.png',
    name: 'Alomerry Wu',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/alomerry' },
      { icon: 'twitter', link: 'https://twitter.com/alomerry' }
    ]
  },
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Our Team</template>
    <template #lead>...</template>
  </VPTeamPageTitle>
  <VPTeamMembers size="small" :members="coreMembers" />
  <VPTeamPageSection>
		<template #title>Partners</template>
		<template #lead>...</template>
		<template #members>
			<VPTeamMembers size="small" :members="partners" />
		</template>
	</VPTeamPageSection>
</VPTeamPage>