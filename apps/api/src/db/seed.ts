import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { db } from './client'
import { words } from './schema'

const csv = readFileSync(resolve(import.meta.dir, 'seeds.csv'), 'utf-8')
const rows = csv.trim().split('\n').slice(1) // skip header

const existing = await db.select({ content: words.content }).from(words)
const existingSet = new Set(existing.map((r) => r.content))
const newRows = rows.filter((content) => !existingSet.has(content))

if (newRows.length === 0) {
  console.log('Nothing to seed')
  process.exit(0)
}

await db.insert(words).values(newRows.map((content) => ({ content })))
console.log(`Seeded ${newRows.length} words (skipped ${rows.length - newRows.length})`)
process.exit(0)
