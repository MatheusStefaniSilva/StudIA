import { Router } from 'express'
import { generateQuiz } from '../controllers/quiz-controller.js'

const router = Router()

router.post('/generate', generateQuiz)


export default router
