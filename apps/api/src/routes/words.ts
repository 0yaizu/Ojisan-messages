import { Hono } from 'hono'
import { sql } from 'drizzle-orm'
import { db } from '../db/client'
import { words } from '../db/schema'

const router = new Hono()

router.get('/random', async (c) => {
  const count = Math.min(Number(c.req.query('count') ?? 5), 50)
  const result = await db
    .select({ id: words.id, content: words.content })
    .from(words)
    .orderBy(sql`RANDOM()`)
    .limit(count)
  return c.json({ words: result })
})

export default router
