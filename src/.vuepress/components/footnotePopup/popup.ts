import { nextTick, onBeforeMount, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { type ThemeBlogHomePageFrontmatter } from "@theme-hope/shared/index.js";
import { usePageFrontmatter } from "@vuepress/client";

export const setupFootnotePopup = () => {
  const router = useRouter();
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
    showFootnotePopup(event.currentTarget?.nextElementSibling as HTMLElement)
  }

  const isFootLink = (ref: HTMLElement) => {
    return ref ? ref.nodeName === 'A' && ref.getAttribute('href')?.startsWith("#footnote") : false
  }

  const isFirstNodeFootLink = (ref: HTMLElement) => {
    return ref && ref.childNodes[0] ? isFootLink(ref.childNodes[0] as HTMLElement) : false
  }

  const isCodePopUp = (ref: HTMLElement) => {
    return ref ? ref.nodeName === 'DIV' && ref.classList.value.indexOf("code-popup") > -1 : false
  }

  const hasSetPopup = () => {
    let hasSet = false;
    (document.querySelectorAll(".footnote-ref") as NodeListOf<HTMLElement>).forEach((link) => {
      if (isCodePopUp(link.nextElementSibling as HTMLElement)) {
        hasSet = true
      }
    })
    return hasSet
  }

  const getFooterId = (ref: HTMLElement) => {
    let result = isFirstNodeFootLink(ref) ? (ref.childNodes[0] as HTMLElement).getAttribute('href')?.replace("#", "") : ""
    return result ? result : ""
  }

  // const getAllFooterIds = () => {
  //   let ids: Array<string> = [];
  //   (document.querySelectorAll('.footnote-item') as NodeListOf<HTMLElement>).forEach((li: HTMLElement) => {
  //     if (li.nodeName === "LI" && li.id.startsWith("footnote")) {
  //       ids.push(li.id)
  //     }
  //   });
  //   return ids
  // }

  const createPopup = (ref: HTMLElement) => {
    // 在 footnote link 下方插入 footer
    let popup = document.createElement("div") as HTMLElement;
    popup.classList.add(...["code-popup", "code-popup-no-backref", "code-popup-hidden"])
    ref.parentNode?.insertBefore(popup, ref.nextElementSibling)

    // 将 pop 插入到 link 下
    let underInsert = document.getElementById(getFooterId(ref))?.childNodes as NodeListOf<ChildNode>
    while (underInsert.length > 0) {
      if (isFootLink(underInsert[0] as HTMLElement)) {
        (underInsert[0] as HTMLElement).classList.add("code-popup-display-none")
        // a 标签理论上在最后
        break;
      } else {
        popup.appendChild(underInsert[0])
      }
    }
  }

  const footnotePopup = () => {
    (document.querySelectorAll(".footnote-ref") as NodeListOf<HTMLElement>).forEach((link) => {
      if (isFirstNodeFootLink(link)) {
        // 设置父标签的 position 用于生成 div 显示在下方
        if (link.parentNode) {
          (link.parentNode as HTMLElement).style.position = "relative"
        }

        // 设置 popup 闪烁样式
        link.classList.add('footnote-ref-popup-source')

        createPopup(link)
        // 给 link 设置点击事件
        link.addEventListener("click", clickFootnote, false)
      }
    })

    document.querySelectorAll('.footnotes-list').forEach((foot) => {
      foot.classList.add("code-popup-display-none")
    })
  }

  const cleanFootnotePopup = () => {
    const getCodePopupFootId = (sup: HTMLElement) => {
      let id = (sup.firstChild as HTMLElement).getAttribute("href")?.replace("#", "")
      if (id) {
        return id
      }
      return ""
    }
    (document.querySelectorAll('.footnote-ref') as NodeListOf<HTMLElement>).forEach((link: HTMLElement) => {
      if (isCodePopUp(link.nextElementSibling as HTMLElement)) {
        let foot = document.getElementById(getCodePopupFootId(link as HTMLElement)) as HTMLElement
        if (foot) {
          let underMove = (link.nextElementSibling as HTMLElement).childNodes
          while (underMove.length > 0) {
            foot.appendChild(underMove[0])
          }
          foot.appendChild(foot.firstChild as HTMLElement)
        }
      }
      link.removeEventListener("click", clickFootnote)
    })
  }

  const needFootnotePopup = () => {
    return frontmatter.value.enableFootnotePopup && !hasSetPopup()
  }

  onBeforeMount(() => {
  })

  onMounted(() => {
    if (needFootnotePopup()) {
      footnotePopup()
    }
    nextTick(() => {
      if (needFootnotePopup()) {
        footnotePopup()
      }
    });
    router.afterEach((to) => {
      if (needFootnotePopup()) {
        setTimeout(() => {
          footnotePopup()
        }, 1000)
      }
    });
    router.beforeEach((to, from) => {
      if (frontmatter.value.enableFootnotePopup && to.path.indexOf(from.path) == -1) { // leave page 需要清理
        cleanFootnotePopup();
      }
    });
  });
}
