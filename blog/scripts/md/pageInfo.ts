import { resolve } from 'node:path'
import fs from 'node:fs'
import type { PluginSimple } from 'markdown-it'
import dayjs from 'dayjs'

const cnWordPerMinute = 350
const enWordPerMinute = 160

const validDate = '1997-01-13'

export const pageInfo: PluginSimple = (md) => {
  const text = md.renderer.rules.text!
  const idMapper: Map<string, boolean> = new Map([])
  md.renderer.rules.text = (...args) => {
    if (
      !args[3]
      || !args[3].id
      || idMapper.get(args[3].id)
      || (dayjs(args[3].frontmatter?.date || validDate).isValid()
      && dayjs(args[3].frontmatter?.update || validDate).isValid())
    )
      return `${text(...args)}`

    const postLang = args[3].frontmatter.lang || ''
    const rt = getReadingTime(args[3].content)
    const defaultReadingTime = rt.mapper.get('') || []
    args[3].frontmatter.wordCount
      = defaultReadingTime.length === 2 && defaultReadingTime[0]
    args[3].frontmatter.duration
      = defaultReadingTime.length === 2 && `${defaultReadingTime[1]}min`
    rt.mapper.forEach((rs, lang, _) => {
      if (lang === postLang) {
        args[3].frontmatter.wordCount = rs[0]
        args[3].frontmatter.duration = `${rs[1]}min`
      }
    })
    syncToMdSource(
      args[3].id,
      args[3].frontmatter.duration,
      args[3].frontmatter.wordCount,
    )
    idMapper.set(args[3].id, true)
    return `${text(...args)}`
  }
}
const rootPath = () => resolve('.')

const currentISOTime = new Date().toISOString()

interface aRef<T> {
  value: T
}

function syncToMdSource(path: string, duration: string, wordCount: string) {
  const mdContent = fs.readFileSync(path, 'utf8')
  const reg = /---\n(.*\n)+---/
  const frontmatter: aRef<string> = {
    value: (mdContent.match(reg) || [])[0] || '',
  }

  if (updateFrontmatter(frontmatter, duration, wordCount)) {
    console.log(`updating [${path.replace(rootPath(), '')}]'s frontmatter...`)
    fs.writeFileSync(path, mdContent.replace(reg, frontmatter.value), 'utf8')
  }
}

function updateFrontmatter(
  frontmatter: aRef<string>,
  duration: string,
  wordCount: string,
) {
  const res: boolean[] = []
  res.push(updateFrontmatterDuration(frontmatter, duration))
  res.push(updateFrontmatterWordCount(frontmatter, wordCount))
  res.push(updateFrontmatterDate(frontmatter))
  return res.includes(true)
}

// 更新 frontmatter 日期相关
function updateFrontmatterDate(frontmatter: aRef<string>) {
  // 不存在需要更新的 update、now 则结束处理
  if (!frontmatter.value.includes(`update: now`))
    return false
  console.log(frontmatter.value)
  // 需要更新 update 时，如果没有 date 则同时更新 date
  if (frontmatter.value.includes(`update: now`)) {
    frontmatter.value = frontmatter.value.replace(
      /(---\n(.*\n)*)update: now\n((.*\n)*---)/,
      `$1update: ${currentISOTime}\n$3`,
    )
    // 仅在不存在 date 时更新
    if (!frontmatter.value.match(/\ndate:/)) {
      frontmatter.value = frontmatter.value.replace(
        /\n---/,
        `\ndate: ${currentISOTime}\n---`,
      )
    }
  }

  return true
}

function updateFrontmatterWordCount(
  frontmatter: aRef<string>,
  wordCount: string,
) {
  if (!frontmatter.value.includes(`wordCount: ${wordCount}\n`)) {
    const reg: aRef<RegExp> = { value: /\n---/ }
    const replace: aRef<string> = { value: `\nwordCount: ${wordCount}\n---` }
    if (frontmatter.value.includes(`wordCount:`)) {
      reg.value = /(---\n(.*\n)*)wordCount:.*\n((.*\n)*---)/
      replace.value = `$1wordCount: ${wordCount}\n$3`
    }
    frontmatter.value = frontmatter.value.replace(reg.value, replace.value)
    return true
  }
  return false
}

function updateFrontmatterDuration(
  frontmatter: aRef<string>,
  duration: string,
) {
  if (!frontmatter.value.includes(`duration: ${duration}`)) {
    const reg: aRef<RegExp> = { value: /\n---/ }
    const replace: aRef<string> = { value: `\nduration: ${duration}\n---` }
    if (frontmatter.value.includes(`duration:`)) {
      reg.value = /(---\n(.*\n)*)duration:.*\n((.*\n)*---)/
      replace.value = `$1duration: ${duration}\n$3`
    }
    frontmatter.value = frontmatter.value.replace(reg.value, replace.value)
    return true
  }
  return false
}

function getEnWordCount(content: string): number {
  return (
    getWords(content)?.reduce<number>(
      (accumulator, word) =>
        accumulator
        + (word.trim() === '' ? 0 : word.trim().split(/\s+/u).length),
      0,
    ) || 0
  )
}

function getCnWordCount(content: string): number {
  return getChinese(content)?.length || 0
}

function getWordNumber(content: string): number {
  return getEnWordCount(content) + getCnWordCount(content)
}

function getReadingTime(content: string) {
  const count = getWordNumber(content || '')
  const words = count >= 1000 ? `${Math.round(count / 100) / 10}k` : count

  const enWord = getEnWordCount(content)
  const cnWord = getCnWordCount(content)

  const enReadingTime = enWord / enWordPerMinute
  const cnReadingTime = cnWord / cnWordPerMinute
  const readingTime = enReadingTime + cnReadingTime
  const readTime
    = readingTime < 1 ? '1' : Number.parseInt(`${readingTime}`, 10)

  const mapper = new Map([
    ['', [words, readTime]],
    ['en', [enWord, enReadingTime]],
    ['cn', [cnWord, cnReadingTime]],
  ])
  return {
    mapper,
  }
}

function getWords(content: string): RegExpMatchArray | null {
  return content.match(/[\w\d\s,.\u00C0-\u024F\u0400-\u04FF]+/giu)
}

function getChinese(content: string): RegExpMatchArray | null {
  return content.match(/[\u4E00-\u9FD5]/gu)
}
