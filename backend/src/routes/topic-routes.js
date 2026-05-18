import { Router } from 'express'
import { getTopics, createTopic, updateTopic, deleteTopic } from '../controllers/topic-controller.js'

const router = Router()

router.get('/', getTopics)
router.post('/', createTopic)
router.put('/:id', updateTopic)
router.delete('/:id', deleteTopic)

export default router