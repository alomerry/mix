import { defineClientConfig } from '@vuepress/client'
import { setupCodeCopy } from './setup'

import './styles/index.css'

export default defineClientConfig({
  setup: () => {
    setupCodeCopy()
  },
})
