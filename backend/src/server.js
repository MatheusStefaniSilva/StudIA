import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import topicRoutes from './routes/topic-routes.js'
import subtopicRoutes from './routes/subtopic-routes.js'
import quizRoutes from './routes/quiz-routes.js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'StudIA backend está funcionando' })
})

app.use('/topics', topicRoutes)
app.use('/subtopics', subtopicRoutes)
app.use('/quiz', quizRoutes)

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`)
})