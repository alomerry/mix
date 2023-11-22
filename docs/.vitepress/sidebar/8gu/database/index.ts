import { type DefaultTheme } from 'vitepress'
import { BaGuMySQL } from './mysql'
import { BaGuRedis } from './redis'
import { BaGuMongoDB } from './mongodb'
import { BaGuElasticSearch } from './elastic-search'

export function BaGuDatabase(): DefaultTheme.SidebarMulti {
  return {
    '/8gu/database/mysql': BaGuMySQL(),
    '/8gu/database/redis': BaGuRedis(),
    '/8gu/database/mongodb': BaGuMongoDB(),
    '/8gu/database/elastic-search': BaGuElasticSearch(),
  }
}