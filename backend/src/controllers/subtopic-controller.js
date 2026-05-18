import { prisma } from '../util/prisma.js'

export async function createSubtopic(req, res) {
  try {
    const newSubtopic = await prisma.subtopic.create({
      data: {
        title: req.body.title,
        topicId: req.params.topicId,
      }
    })
    res.status(201).json(newSubtopic)
  } catch (error) {
    if (error.code === 'P2002')
      return res.status(409).json({ error: 'Esse subtópico já existe neste tópico.' })
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function updateSubtopic(req, res) {
  try {
    const updatedSubtopic = await prisma.subtopic.update({
      where: { id: req.params.subtopicId },
      data: {
        title: req.body.title,       // ← removido area, pois Subtopic não tem esse campo
      }
    })
    res.status(200).json(updatedSubtopic)
  } catch (error) {
    if (error.code === 'P2025')
      return res.status(404).json({ error: 'Subtópico não encontrado.' })
    if (error.code === 'P2002')
      return res.status(409).json({ error: 'Esse título já existe neste tópico.' })
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function deleteSubtopic(req, res) {
  try {
    await prisma.subtopic.delete({ where: { id: req.params.subtopicId } })
    res.status(200).json({ message: 'Subtópico removido.' })
  } catch (error) {
    if (error.code === 'P2025')
      return res.status(404).json({ error: 'Subtópico não encontrado.' })
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}