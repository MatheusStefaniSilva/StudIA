import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import api from '../../services/api'

function Home() {

  const [topics, setTopics] = useState([])
  const [activeTopicIndex, setActiveTopicIndex] = useState(0)
  const [activeSubtopicIndex, setActiveSubtopicIndex] = useState(0)
  const [questionCount, setQuestionCount] = useState(5)
  const activeTopic = topics[activeTopicIndex] ?? { subtopics: [] }
  const navigate = useNavigate()
  const carouselRef = useRef(null)

  useEffect(() => {
    fetchTopics().then(fetchedTopics => {
      setTopics(fetchedTopics)
    })
  }, [])

  async function fetchTopics() {
    try {
      const response = await api.get('/topics')
      return response.data
    } catch (error) {
      console.error('Erro ao buscar tópicos:', error)
      return []
    }
  }

  function scrollCarousel(dir) {
    carouselRef.current?.scrollBy({ left: dir * 160, behavior: 'smooth' })
  }

  function handleStartQuiz() {
    const topic = topics[activeTopicIndex]
    const subtopic = activeTopic.subtopics[activeSubtopicIndex]
    if (!topic || !subtopic) return
    navigate('/quiz', {
      state: {
        topicTitle: topic.title,
        subtopicTitle: subtopic.title,
        questionCount,
      }
    })
  }

  return (
    <div className="container">
      <img
        src="https://img.icons8.com/ios/50/settings--v1.png"
        alt="Configurações"
        onClick={() => navigate('/settings')}
        className="settings-icon"
      />

      <div className="home-page">
        <header className="home-header">
          <h1>StudIA</h1>
          <p>Escolha o assunto das questões</p>
        </header>

        <div className="carousel-wrapper">
          <button className="carousel-arrow" onClick={() => scrollCarousel(-1)}>‹</button>
          <section className="carousel-row" ref={carouselRef}>
            {topics.map((topic, index) => (
              <button
                key={topic.id}
                type="button"
                className={`topic-pill ${index === activeTopicIndex ? 'active' : ''}`}
                onClick={() => {
                  setActiveTopicIndex(index)
                  setActiveSubtopicIndex(0)
                }}
              >
                {topic.title}
              </button>
            ))}
          </section>
          <button className="carousel-arrow" onClick={() => scrollCarousel(1)}>›</button>
        </div>

        <section className="subtopic-panel">
          {activeTopic.subtopics.map((subtopic, index) => (
            <button
              key={subtopic.id}
              type="button"
              className={`subtopic-chip ${index === activeSubtopicIndex ? 'active' : ''}`}
              onClick={() => setActiveSubtopicIndex(index)}
            >
              {subtopic.title}
            </button>
          ))}
        </section>

        <div className="question-count-row">
          <label htmlFor="questionCount" className="question-count-label">
            Número de questões
          </label>
          <div className="question-count-controls">
            <button
              type="button"
              className="count-btn"
              onClick={() => setQuestionCount(q => Math.max(1, q - 1))}
            >−</button>
            <span className="count-value">{questionCount}</span>
            <button
              type="button"
              className="count-btn"
              onClick={() => setQuestionCount(q => Math.min(20, q + 1))}
            >+</button>
          </div>
        </div>

        <button
          className="startBttn"
          onClick={handleStartQuiz}
          disabled={!activeTopic.subtopics.length}
        >
          Iniciar Quiz
        </button>
      </div>
    </div>
  )
}

export default Home