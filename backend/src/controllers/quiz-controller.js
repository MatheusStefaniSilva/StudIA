import { GoogleGenAI } from '@google/genai'
import 'dotenv/config'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function generateQuiz(req, res) {
  const { topicTitle, subtopicTitle, questionCount = 5 } = req.body

  if (!topicTitle || !subtopicTitle) {
    return res.status(400).json({ error: 'topicTitle e subtopicTitle são obrigatórios.' })
  }

  const count = Math.min(Math.max(parseInt(questionCount) || 5, 1), 20)

  const prompt = `Você é um gerador de questões educacionais em português brasileiro.
Gere exatamente ${count} questões de múltipla escolha sobre o subtópico "${subtopicTitle}" dentro do tópico "${topicTitle}".

Regras:
- As questões devem ser claras, educativas e de nível universitário/vestibular.
- Cada questão deve ter exatamente 4 alternativas (A, B, C, D).
- Apenas UMA alternativa deve ser correta.
- Inclua uma explicação breve (2-3 frases) da resposta correta.

Retorne APENAS um JSON válido, sem texto extra, sem markdown, sem blocos de código. Siga este formato exato:
{
  "questions": [
    {
      "id": 1,
      "question": "Texto da pergunta aqui?",
      "options": ["A) Opção A", "B) Opção B", "C) Opção C", "D) Opção D"],
      "correctIndex": 0,
      "explanation": "Explicação breve aqui."
    }
  ]
}`

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    })

    const rawText = response.text.trim()

    const jsonText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

    let parsed
    try {
      parsed = JSON.parse(jsonText)
    } catch {
      console.error('Erro ao parsear resposta da IA:', jsonText)
      return res.status(502).json({ error: 'A IA retornou um formato inválido. Tente novamente.' })
    }

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      return res.status(502).json({ error: 'Resposta da IA fora do formato esperado.' })
    }

    return res.status(200).json({
      topic: topicTitle,
      subtopic: subtopicTitle,
      questions: parsed.questions,
    })
  } catch (error) {
    console.error('Erro ao chamar Gemini:', error)
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ error: 'Limite de requisições da IA atingido. Aguarde alguns segundos e tente novamente.' })
    }
    if (error.status === 401 || error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      return res.status(401).json({ error: 'Chave de API do Gemini inválida ou ausente.' })
    }
    return res.status(500).json({ error: 'Erro ao gerar questões. Tente novamente.' })
  }
}
