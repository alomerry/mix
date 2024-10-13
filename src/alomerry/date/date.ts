import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import relativeTime from 'dayjs/plugin/relativeTime'
// import 'dayjs/locale/zh-cn'

dayjs.extend(utc)
// dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

export function getFromNow(date: string | Date): string | null {
  if (date)
    return dayjs(date).utc().local().fromNow()
  return null
}
