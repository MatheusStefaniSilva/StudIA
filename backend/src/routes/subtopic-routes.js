import { Router } from 'express'
import { createSubtopic, updateSubtopic, deleteSubtopic } from '../controllers/subtopic-controller.js'

const router = Router()

router.post('/:topicId/subtopics', createSubtopic)
router.put('/:topicId/:subtopicId', updateSubtopic)
router.delete('/:topicId/:subtopicId', deleteSubtopic)

export default router