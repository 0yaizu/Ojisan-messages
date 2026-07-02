import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { db } from './client'
import { words } from './schema'

const csv = readFileSync(resolve(import.meta.dir, 'seeds.csv'), 'utf-8')
const rows = csv.trim().split('\n').slice(1) // skip header

await db.insert(words).values(rows.map((content) => ({ content })))
console.log(`Seeded ${rows.length} words`)
process.exit(0)
