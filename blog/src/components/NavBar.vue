<script setup lang="ts">
import Search from "~/components/alomerry/Search.vue";

function toTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

const { y: scroll } = useWindowScroll();
</script>

<template>
  <header class="header z-40">
    <RouterLink
      class="w-12 h-12 absolute xl:fixed m-5 select-none outline-none"
      to="/"
      focusable="false"
    >
      <Logo />
    </RouterLink>
    <button
      title="Scroll to top"
      fixed
      right-3
      bottom-3
      w-10
      h-10
      hover:op100
      rounded-full
      hover-bg-hex-8883
      transition
      duration-300
      z-100
      print:hidden
      :class="scroll > 300 ? 'op30' : 'op0! pointer-events-none'"
      @click="toTop()"
    >
      <div i-ri-arrow-up-line />
    </button>
    <nav class="nav">
      <div class="spacer" />
      <div class="right" print:op0>
        <!-- <RouterLink to="/talks" class="lt-md:hidden" title="Talks">
          Talks
        </RouterLink> -->
        <!-- <RouterLink to="/podcasts" class="lt-md:hidden" title="Podcasts">
          Podcasts
        </RouterLink> -->
        <!-- <RouterLink to="/demos" title="Demos">
          <span class="lt-md:hidden">Demos</span>
          <div i-ri-screenshot-line class="md:hidden" />
        </RouterLink> -->
        <!-- i-ri-article-line -->
        <RouterLink to="/posts" title="文章">
          <!-- <span class="lt-md:hidden">Blog</span> -->
          <div i-svg-spinners-blocks-shuffle-3 />
        </RouterLink>
        <RouterLink to="/pinned" title="Pinned">
          <!-- <span class="lt-md:hidden">Pinned</span> -->
          <div i-tabler-pinned-filled />
        </RouterLink>
        <a href="/docs" title="Notes">
          <div i-material-symbols-export-notes-outline-sharp />
        </a>
        <a href="/ioi" title="IOI">
          <div i-tabler-brand-leetcode />
        </a>
        <Search />
        <a
          href="https://github.com/alomerry/mix"
          target="_blank"
          title="GitHub"
          class="lt-md:hidden"
        >
          <div i-uil-github-alt />
        </a>
        <a href="/diary" title="Diary">
          <div i-ion-journal />
        </a>
        <a
          href="https://cloud.umami.is/share/JiMJBPEtX9WuB4Xb/blog.alomerry.com"
          target="_blank"
          title="Umami"
        >
          <div i-simple-icons-umami />
        </a>
        
        <a
          href="https://medium.com/@alomerry.wu/about"
          target="_blank"
          title="Medium"
          class="lt-md:hidden"
        >
          <div i-basil-medium-solid />
        </a>
        <a
          href="https://twitter.com/alomerry_qwq"
          target="_blank"
          title="Twitter"
          class="lt-md:hidden"
        >
          <div i-ri-twitter-x-fill />
        </a>
        <ToggleTheme />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header h1 {
  margin-bottom: 0;
}

.logo {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
}

.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav > * {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}
</style>
