<template>
  <div class="code-popup-warpper">
    <div @click="handleToggle" class="code-popup-source">
      <slot>Set your source</slot>
    </div>
    <div :class="codePopupClass" @mouseleave="toggle(false)">
      <slot name="code">Set your code</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

let codePopupClass = ref(["code-popup", "code-popup-hidden"]);

function handleToggle(event: any) {
  const target = event.target;
  if (target?.nodeName === 'MARK') {
    toggle(true)
  }
}

const toggle = (show: boolean) => {
  if (show) {
    codePopupClass.value = ["code-popup", "code-popup-hover"]
  } else {
    codePopupClass.value = ["code-popup", "code-popup-hidden"]
  }
};
</script>

<style lang="scss">
.code-popup-warpper {
  position: relative;

  .code-popup-source {
    display: inline-block;
  }

  .code-popup-source mark {
    color: #096dd9;
    animation: color-transition 1.5s linear infinite;
    display: inline-block;
    background-color: unset !important;
  }

  .code-popup {
    z-index: 3;
    border-radius: 10px;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: var(--content-width);
    max-width: 90%;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }

  .code-popup-hover {
    visibility: visible;
    opacity: 1;
    top: calc(100% + 10px);
  }

  .code-popup-hidden {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.5s ease-in-out;
  }
}

@keyframes color-transition {
  0% {
    color: #84b9df;
  }

  10% {
    color: #6ba1d6;
  }

  20% {
    color: #4e89cc;
  }

  30% {
    color: #3161c2;
  }

  40% {
    color: #2167FF;
  }

  50% {
    color: #2167FF;
  }

  60% {
    color: #3161c2;
  }

  70% {
    color: #4e89cc;
  }

  80% {
    color: #6ba1d6;
  }

  90% {
    color: #84b9df;
  }

  100% {
    color: #84b9df;
  }

}
</style>