<!--<script setup lang="ts">-->
<!--import { useRoute } from "vue-router";-->
<!--import { englishOnly } from "~/logics";-->
<!--import { button_english_only_enable, subCategories } from "~/alomerry";-->

<!--const props = defineProps<{-->
<!--  type?: string;-->
<!--}>();-->
<!--const inactiveStyle = "opacity-20 hover:opacity-50";-->
<!--const activeStyle = "opacity-100 underline";-->

<!--const route = useRoute();-->
<!--const currentCategories = subCategories(props.type);-->
<!--</script>-->

<!--<template>-->
<!--  <div-->
<!--    v-if="currentCategories.length > 0"-->
<!--    class="prose m-auto mb-8 select-none animate-none! op100!"-->
<!--  >-->
<!--    <button-->
<!--      v-if="button_english_only_enable"-->
<!--      flex="~ gap1"-->
<!--      items-center-->
<!--      mb2-->
<!--      op30-->
<!--      text-sm-->
<!--      @click="englishOnly = !englishOnly"-->
<!--    >-->
<!--      <div :i="englishOnly ? 'carbon-checkbox-checked' : 'carbon-checkbox'" />-->
<!--      English Only-->
<!--    </button>-->

<!--    <div mb-0 flex="~ col gap-1 sm:row sm:gap-3 wrap" text-2xl>-->
<!--      <RouterLink-->
<!--        v-for="category of currentCategories"-->
<!--        :key="category.to"-->
<!--        :to="category.to"-->
<!--        class="!border-none"-->
<!--        :class="route.path === category.to ? activeStyle : inactiveStyle"-->
<!--      >-->
<!--        {{ category.name }}-->
<!--      </RouterLink>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->
