import { Hono } from 'hono'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = new Hono()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

router.post('/', async (c) => {
  const { sentence } = await c.req.json<{ sentence: string }>()
  if (!sentence?.trim()) {
    return c.json({ error: 'sentence is required' }, 400)
  }

  const prompt = `あなたは日本語文章の採点者です。
以下の文章の自然さを100点満点で採点し、必ずJSONのみで返してください。余分なテキストは不要です。
{ "score": <0-100の整数>, "comment": "<採点理由・感想>" }

文章: ${sentence}`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim().replace(/^```json\n?|\n?```$/g, '')
  const { score, comment } = JSON.parse(text) as { score: number; comment: string }

  return c.json({ score, comment })
})

export default router
