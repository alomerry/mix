export interface Post {
  path: string
  title: string
  place?: string
  date: string
  update?: string
  pinned?:boolean
  lang?: string
  desc?: string
  platform?: string
  duration?: string
  wordCount?: string
  recording?: string
  radio?: boolean
  video?: boolean
  inperson?: boolean
  redirect?: string
}
