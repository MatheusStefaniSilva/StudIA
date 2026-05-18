import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

const data = [
  {
    title: "IA",
    area: "Tecnologia",
    subtopics: ["Machine Learning", "Visão Computacional", "Processamento de Linguagem Natural", "Aprendizado por Reforço", "Modelos Generativos"]
  },
  {
    title: "Dados",
    area: "Tecnologia",
    subtopics: ["SQL", "NoSQL", "Data Warehouse", "ETL", "Análise Exploratória"]
  },
  {
    title: "Design",
    area: "Produto",
    subtopics: ["UX", "UI", "Prototipagem", "Design System", "Acessibilidade"]
  },
  {
    title: "Desenvolvimento",
    area: "Tecnologia",
    subtopics: ["React", "Node.js", "APIs", "Testes", "Versionamento"]
  },
  {
    title: "Infraestrutura",
    area: "Tecnologia",
    subtopics: ["Docker", "Kubernetes", "CI/CD", "Servidores", "Observabilidade"]
  },
  {
    title: "Segurança",
    area: "Tecnologia",
    subtopics: ["Autenticação", "Criptografia", "OWASP", "Auditoria", "Gestão de Credenciais"]
  },
  {
    title: "Produtividade",
    area: "Gestão",
    subtopics: ["Kanban", "Automação", "Documentação", "Reuniões Eficazes", "Gestão de Tempo"]
  },
  {
    title: "Negócios",
    area: "Gestão",
    subtopics: ["Modelos de Receita", "Persona", "Roadmap", "Métricas", "Pitch"]
  }
]

async function main() {
  console.log('🌱 Iniciando seed...')

  for (const item of data) {

    // 1. Upsert do tópico
    const topic = await prisma.topic.upsert({
      where: { title: item.title },
      update: {},
      create: {
        title: item.title,
        area: item.area,
      }
    })

    // 2. Upsert de cada subtópico individualmente
    for (const subtopicTitle of item.subtopics) {
      await prisma.subtopic.upsert({
        where: {
          title_topicId: {       // ← índice único composto que configuramos
            title: subtopicTitle,
            topicId: topic.id
          }
        },
        update: {},
        create: {
          title: subtopicTitle,
          topicId: topic.id
        }
      })
    }

    console.log(`✅ ${topic.title} — ${item.subtopics.length} subtópicos processados`)
  }

  console.log('🎉 Seed concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })