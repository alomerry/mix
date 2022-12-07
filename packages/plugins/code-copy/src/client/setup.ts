import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { ACodeCopyOptions } from '../shared/types'

declare const CODE_COPY_OPTIONS: Required<ACodeCopyOptions>
const options = CODE_COPY_OPTIONS

const isMobile = (): boolean => navigator
  ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/iu.test(
    navigator.userAgent,
  )
  : false

export const setupCodeCopy = (): void => {
  const route = useRoute()
  const copySvg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z"></path><path fill="currentColor" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z"></path></svg>'
  const copiedSvg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--carbon" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path fill="#7ff77d" d="m13 24l-9-9l1.414-1.414L13 21.171L26.586 7.586L28 9L13 24z"></path></svg>'

  const insertCopyButton = (codeBlockElement: HTMLElement): void => {
    if (!codeBlockElement.hasAttribute('code-copy-registed')) {
      const copyButton = document.createElement('div')
      copyButton.className = 'code-copy-button'
      copyButton.innerHTML = copySvg

      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(codeBlockElement.innerText)
        copyButton.innerHTML = copiedSvg
        setTimeout(() => {
          copyButton.innerHTML = copySvg
        }, 1000)
      })

      if (codeBlockElement.parentElement) {
        codeBlockElement.parentElement.insertBefore(
          copyButton,
          codeBlockElement,
        )
      }
      codeBlockElement.setAttribute('copy-code-registered', '')
    }
  }

  const getCopyButton = () => {
    const selector = options.selector || 'div[class*="language-"] pre'

    const unset = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector)
        .forEach((t) => {
          insertCopyButton(t)
        })
      clearTimeout(unset)
    }, 500)
  }

  onMounted(() => {
    if (!isMobile())
      getCopyButton()

    watch(() => route.path, () => {
      if (!isMobile())
        getCopyButton()
    })
  })
}
