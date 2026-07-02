import { Hono } from 'hono'
import wordsRoute from './routes/words'
import scoreRoute from './routes/score'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'ok' }))
app.route('/api/words', wordsRoute)
app.route('/api/score', scoreRoute)

export default {
	port: 3000,
	fetch: app.fetch,
}