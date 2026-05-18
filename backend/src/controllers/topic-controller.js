import { prisma } from '../util/prisma.js'

export async function getTopics(req, res) {
  const topics = await prisma.topic.findMany({
    include: { subtopics: true }    // ← inclui subtópicos
  })
  res.status(200).json(topics)
}

export async function createTopic(req, res) {
  try {
    const newTopic = await prisma.topic.create({
      data: {
        title: req.body.title,
        area: req.body.area,
      }
    })
    res.status(201).json(newTopic)
  } catch (error) {
    if (error.code === 'P2002')
      return res.status(409).json({ error: 'Esse tópico já existe.' })
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function updateTopic(req, res) {
  try {
    const updatedTopic = await prisma.topic.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        area: req.body.area,
      }
    })
    res.status(200).json(updatedTopic)
  } catch (error) {
    if (error.code === 'P2025')
      return res.status(404).json({ error: 'Tópico não encontrado.' })
    if (error.code === 'P2002')
      return res.status(409).json({ error: 'Esse título já existe para outro tópico.' })
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}


export async function deleteTopic(req, res) {
  try {
    await prisma.subtopic.deleteMany({ where: { topicId: req.params.id } })
    await prisma.topic.delete({ where: { id: req.params.id } })
    res.status(200).json({ message: 'Tópico removido.' })
  } catch (error) {
    if (error.code === 'P2025')
      return res.status(404).json({ error: 'Tópico não encontrado.' })
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}
