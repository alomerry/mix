import { nextTick, onMounted, onBeforeUnmount } from "vue";
import { type ThemeBlogHomePageFrontmatter } from "@theme-hope/shared/index.js";
import { usePageFrontmatter } from "@vuepress/client";

export const setupFootnotePopup = () => {
  const frontmatter = usePageFrontmatter<ThemeBlogHomePageFrontmatter>();

  const documentEventHandler = (event) => {
    // 如果点击弹窗自身时，不触发隐藏逻辑
    if (!(document.querySelectorAll('.code-popup.code-popup-hover')[0].contains(event.target) || event.target.nodeName === 'A' && event.target.getAttribute('href')?.startsWith("#footnote"))) {
      hiddenFootnotePopup()
    }
  }

  const hiddenFootnotePopup = () => {
    let item = document.querySelectorAll('.code-popup.code-popup-hover')[0]
    if (item) {
      item.classList.remove("code-popup-hover")
      item.classList.add("code-popup-hidden")
      document.removeEventListener('click', documentEventHandler);
    }
  };

  const showFootnotePopup = (item: any) => {
    hiddenFootnotePopup()
    item.classList.remove("code-popup-hidden")
    item.classList.add("code-popup-hover")
    nextTick(() => {
      document.addEventListener('click', documentEventHandler);
    });
  };

  const clickFootnote = (event: any) => {
    event.preventDefault()
    showFootnotePopup(event.currentTarget?.nextSibling)
  }

  const handleFootnotePopup = () => {
    if (frontmatter.value.enableFootnotePopup) {
      // 隐藏原始 footer
      document.querySelectorAll('.footnotes-list').forEach((foot) => {
        foot.style.display = "none"
      })

      document.querySelectorAll('.footnote-ref').forEach((fe) => {
        // 设置父标签的 position 用于生成 div 显示在下方
        if (fe.parentNode) {
          fe.parentNode.style.position = "relative"
        }
        fe.classList.add('footnote-ref-popup-source')
        if (fe.childNodes[0].nodeName === 'A' && fe.childNodes[0].getAttribute('href')?.startsWith("#footnote")) {
          let popup = document.createElement("div");
          let footerCode = document.getElementById(fe.childNodes[0].getAttribute('href').replace("#", ""))?.innerHTML
          popup.innerHTML = footerCode ? footerCode : ""
          popup.classList.add(...["code-popup", "code-popup-no-backref", "code-popup-hidden"])
          fe.parentNode?.insertBefore(popup, fe.nextSibling);
          // 给 a 标签设置点击事件
          fe.addEventListener("click", clickFootnote, false)
        }
      })
    }
  }
  onMounted(() => {
    handleFootnotePopup()
  });
  onBeforeUnmount(() => {
    document.querySelectorAll('.footnote-ref').forEach((fe) => {
      fe.removeEventListener("click", clickFootnote)
    })
  })
}
