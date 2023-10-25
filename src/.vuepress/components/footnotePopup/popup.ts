import { nextTick, onBeforeMount, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { type ThemeBlogHomePageFrontmatter } from "@theme-hope/shared/index.js";
import { usePageFrontmatter } from "@vuepress/client";


export const setupFootnotePopup = () => {
  class FooterSup {
    sup: HTMLElement

    constructor(sup: HTMLElement) {
      this.sup = sup
    }

    firstA(): HTMLElement {
      let sup1stItem = (this.sup?.childNodes[0] as HTMLElement);
      return sup1stItem;
    }

    hasMultiRef(): boolean {
      return this.firstA().innerHTML.indexOf(":") > -1;
    }

    secendA(): HTMLElement {
      let sup2endItem = (this.sup?.childNodes[1] as HTMLElement);
      return sup2endItem;
    }

    addFlash(): void { // 设置 popup 闪烁样式
      this.sup.classList.add('footnote-ref-popup-source')
    }

    addClickListener(): void { // 给 sup 设置点击事件
      this.sup.addEventListener("click", clickListener, false)
    }

    getMutiOtherSup(): Array<HTMLElement> {
      let sameSups: Array<HTMLElement> = [];
      (document.querySelectorAll('.footnote-ref') as NodeListOf<HTMLElement>).forEach((sup: HTMLElement) => {
        if (!sup.childNodes[2] && (sup.childNodes[0] as HTMLElement).getAttribute("href") === this.firstA().getAttribute("href")) {
          sameSups.push(sup)
        }
      })
      return sameSups;
    }

    setPopup(): void {
      if (this.hasMultiRef()) {
        return
      }

      if (this.footer()?.childNodes.length >= 2) {
        let warp = document.createElement("div") as HTMLElement;
        let popup = document.createElement("div") as HTMLElement;
        popup.classList.add(...["code-popup", "code-popup-no-backref", "code-popup-hidden"])
        warp.classList.add(...["code-popup-warp"])
        warp.appendChild(popup)
        this.sup?.insertBefore(warp, null); // 插在 sup 内的最后位置
        let underInsert = this.footer()?.childNodes as NodeListOf<ChildNode>
        let index = 0;
        while (underInsert.length > index) {
          if (this.hasFootLink(underInsert[index] as HTMLElement)) {
            (underInsert[0] as HTMLElement).classList.add("code-popup-display-none")
            // a 标签理论上在最后
            index++;
          } else {
            popup.appendChild(underInsert[index])
          }
        }

        this.getMutiOtherSup().forEach((otherSups: HTMLElement) => {
          otherSups.insertBefore(warp.cloneNode(true), null);
        })
      }

    }

    footer(): HTMLElement {
      return document.getElementById(this.footId())
    }

    footId(): string {
      let firstA = this.firstA();
      return firstA.getAttribute('href')?.replace("#", "") || '';
    }

    hasFootLink(he: HTMLElement): boolean {
      if (!he || he.nodeName !== 'A' || !he.getAttribute('href') || !he.getAttribute('href')?.startsWith("#footnote")) {
        return false;
      }
      return true;
    }

    valid(): boolean {
      // 是否是 sup.a 标签，是否包含 footnote 的 id
      if (!this.hasFootLink(this.firstA())) {
        return false;
      }
      if (!this.footer()) {
        return false;
      }
      return true;
    }

    reset(): void {
      for (let i = this.sup.childNodes.length - 1; i >= 3; i--) {
        this.sup.childNodes[i].remove();
      }

      if (this.sup.childNodes[2] && this.sup.childNodes[2].childNodes[0].childNodes.length > 0) {
        return;
      } else if (this.sup.childNodes[2]) {
        this.sup.childNodes[2].remove();
      }

    }

    setup(): void {
      if (this.valid()) {
        this.reset();
        this.addFlash()
        this.setPopup();
        this.addClickListener();
      } else {
        console.log("this sup is invalid")
      }
    }

    clean(): void {
      if (this.hasMultiRef()) {
        this.getMutiOtherSup().forEach((otherSups: HTMLElement) => {
          if (otherSups.children[2]) {
            otherSups.childNodes[2].remove();
          }
        })
        return;
      }
      if (this.sup.childNodes[2]) {
        this.sup.childNodes[2].childNodes[0].childNodes.forEach((item) => {
          this.footer().insertBefore(item, null);
        })
        this.sup.childNodes[2].remove();
        // let inner = this.footer()?.childNodes[0]
        // if (inner) {
        //   while ((inner as HTMLElement).nodeName === "A") {
        //     this.footer()?.appendChild((inner as HTMLElement))
        //   }
        // }
        this.sup.removeEventListener('click', clickListener)
      }
    }
  }
  let article: HTMLElement;
  const router = useRouter();
  const frontmatter = usePageFrontmatter<ThemeBlogHomePageFrontmatter>();
  let footerSups: Array<FooterSup> = [];

  const gobalClickListener = (event) => {
    // 如果点击弹窗自身时，不触发隐藏逻辑
    if (!(document.querySelectorAll('.code-popup.code-popup-hover')[0]?.contains(event.target) || event.target.nodeName === 'A' && event.target.getAttribute('href')?.startsWith("#footnote"))) {
      let hasHovered = document.querySelectorAll('.code-popup.code-popup-hover')[0]
      if (hasHovered) {
        hasHovered.classList.remove("code-popup-hover")
        hasHovered.classList.add("code-popup-hidden")
        document.removeEventListener('click', gobalClickListener);
      }
    }
  }

  const clickListener = (event: any) => {
    if (!(event.target.nodeName === 'A' && event.target.getAttribute('href')?.startsWith("#footnote"))) {
      return;
    }
    event.preventDefault()
    let needHoverDiv = (event.currentTarget as HTMLElement).childNodes[2]

    // 点击后将已 hover 的设置为 hidden
    let hasHovered = document.querySelectorAll('.code-popup.code-popup-hover')[0]
    if (hasHovered) {
      hasHovered.classList.remove("code-popup-hover")
      hasHovered.classList.add("code-popup-hidden")
      document.removeEventListener('click', gobalClickListener);
    }

    if (needHoverDiv) {
      (needHoverDiv.firstChild as HTMLElement).classList.remove("code-popup-hidden");
      (needHoverDiv.firstChild as HTMLElement).classList.add("code-popup-hover");
      let articlePaddingLeft: number = parseFloat(window.getComputedStyle(article, null).getPropertyValue('padding-left')); //获取左侧内边距
      let articleWidth = parseFloat(window.getComputedStyle(article, null).getPropertyValue('width'));
      let popupLeft = article.offsetLeft - event.clientX + articlePaddingLeft;
      (needHoverDiv as HTMLElement).setAttribute('style', `left: ${popupLeft}px; width: ${articleWidth}px`);
      nextTick(() => {
        document.addEventListener('click', gobalClickListener);
      });
    }
  }

  const setup = () => {
    (document.querySelectorAll(".theme-hope-content") as NodeListOf<HTMLElement>).forEach((content) => {
      article = content;
    });
    (document.querySelectorAll(".footnote-ref") as NodeListOf<HTMLElement>).forEach((sup) => {
      footerSups.push(new FooterSup(sup));
    })
    footerSups.forEach((sup) => {
      sup.setup();
    })
    document.querySelectorAll('.footnotes-list').forEach((foot) => {
      foot.classList.add("code-popup-display-none")
    })
  }

  const clean = () => {
    footerSups.forEach((sup) => {
      sup.clean();
    })
  }

  const hasSetPopup = () => {
    let hasSet = false;
    (document.querySelectorAll(".footnote-ref") as NodeListOf<HTMLElement>).forEach((sup) => {
      if (sup.childNodes[2]) {
        hasSet = true
      }
    })
    return hasSet;
  }

  const needFootnotePopup = () => {
    return frontmatter.value.enableFootnotePopup && !hasSetPopup()
  }

  onBeforeMount(() => {
  })

  onMounted(() => {
    if (needFootnotePopup()) {
      setup();
    }
    router.afterEach((to) => {
      setTimeout(() => {
        setup();
      }, 500)
    });
    router.beforeEach((to, from) => {
      if (frontmatter.value.enableFootnotePopup && to.path.indexOf(from.path) == -1) { // leave page 需要清理
        clean();
        console.log('clean finished!')
      }
    });
  });
}
