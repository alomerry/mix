<script setup lang="ts">
import Footer from "./footer/index.vue";
import { useGlobal } from "@pureadmin/utils";
import KeepAliveFrame from "./keepAliveFrame/index.vue";
import backTop from "@/assets/svg/back_top.svg?component";
import {
  h,
  ref,
  computed,
  Transition,
  defineComponent,
  onMounted,
  nextTick
} from "vue";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useWatermark } from "@pureadmin/utils";

const props = defineProps({
  fixedHeader: Boolean
});

const { $storage, $config } = useGlobal<GlobalPropertiesApi>();

const isKeepAlive = computed(() => {
  return $config?.KeepAlive;
});

const transitions = computed(() => {
  return route => {
    return route.meta.transition;
  };
});

const hideTabs = computed(() => {
  return $storage?.configure.hideTabs;
});

const hideFooter = computed(() => {
  return $storage?.configure.hideFooter;
});

const layout = computed(() => {
  return $storage?.layout.layout === "vertical";
});

const getSectionStyle = computed(() => {
  return [
    hideTabs.value && layout ? "padding-top: 48px;" : "",
    !hideTabs.value && layout ? "padding-top: 85px;" : "",
    hideTabs.value && !layout.value ? "padding-top: 48px;" : "",
    !hideTabs.value && !layout.value ? "padding-top: 85px;" : "",
    props.fixedHeader
      ? ""
      : `padding-top: 0;${
          hideTabs.value
            ? "min-height: calc(100vh - 48px);"
            : "min-height: calc(100vh - 86px);"
        }`
  ];
});

const transitionMain = defineComponent({
  props: {
    route: {
      type: undefined,
      required: true
    }
  },
  render() {
    const transitionName =
      transitions.value(this.route)?.name || "fade-transform";
    const enterTransition = transitions.value(this.route)?.enterTransition;
    const leaveTransition = transitions.value(this.route)?.leaveTransition;
    return h(
      Transition,
      {
        name: enterTransition ? "pure-classes-transition" : transitionName,
        enterActiveClass: enterTransition
          ? `animate__animated ${enterTransition}`
          : undefined,
        leaveActiveClass: leaveTransition
          ? `animate__animated ${leaveTransition}`
          : undefined,
        mode: "out-in",
        appear: true
      },
      {
        default: () => [this.$slots.default()]
      }
    );
  }
});

/* alomerry */

// https://pure-admin-utils.netlify.app/hooks/useWatermark/useWatermark
const wholePageWatermark = ref();
const { setWatermark: setNormalWatermark } = useWatermark(wholePageWatermark);

onMounted(() => {
  nextTick(() => {
    setNormalWatermark("清欢", {
      font: "lighter 20px Arial, 'Courier New', 'Droid Sans', sans-serif",
      forever: true,
      rotate: -10,
      color: "rgb(166,166,166)",
      globalAlpha: 0.3
    });
  });
});
/* alomerry */
</script>

<template>
  <section
    :class="[props.fixedHeader ? 'app-main' : 'app-main-nofixed-header']"
    :style="getSectionStyle"
  >
    <router-view>
      <template #default="{ Component, route }">
        <KeepAliveFrame :currComp="Component" :currRoute="route">
          <template #default="{ Comp, fullPath, frameInfo }">
            <el-scrollbar
              v-if="props.fixedHeader"
              :wrap-style="{
                display: 'flex',
                'flex-wrap': 'wrap'
              }"
              :view-style="{
                display: 'flex',
                flex: 'auto',
                overflow: 'auto',
                'flex-direction': 'column'
              }"
            >
              <el-backtop
                title="回到顶部"
                target=".app-main .el-scrollbar__wrap"
              >
                <backTop />
              </el-backtop>
              <div ref="wholePageWatermark" class="grow">
                <transitionMain :route="route">
                  <keep-alive
                    v-if="isKeepAlive"
                    :include="usePermissionStoreHook().cachePageList"
                  >
                    <component
                      :is="Comp"
                      :key="fullPath"
                      :frameInfo="frameInfo"
                      class="main-content"
                    />
                  </keep-alive>
                  <component
                    :is="Comp"
                    v-else
                    :key="fullPath"
                    :frameInfo="frameInfo"
                    class="main-content"
                  />
                </transitionMain>
              </div>
              <Footer v-if="!hideFooter" />
            </el-scrollbar>
            <div v-else class="grow">
              <transitionMain ref="wholePageWatermark" :route="route">
                <keep-alive
                  v-if="isKeepAlive"
                  :include="usePermissionStoreHook().cachePageList"
                >
                  <component
                    :is="Comp"
                    :key="fullPath"
                    :frameInfo="frameInfo"
                    class="main-content"
                  />
                </keep-alive>
                <component
                  :is="Comp"
                  v-else
                  :key="fullPath"
                  :frameInfo="frameInfo"
                  class="main-content"
                />
              </transitionMain>
            </div>
          </template>
        </KeepAliveFrame>
      </template>
    </router-view>

    <!-- 页脚 -->
    <Footer v-if="!hideFooter && !props.fixedHeader" />
  </section>
</template>

<style scoped>
.app-main {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
}

.app-main-nofixed-header {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.main-content {
  margin: 24px;
}
</style>
