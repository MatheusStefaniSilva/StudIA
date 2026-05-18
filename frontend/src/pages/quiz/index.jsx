import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import './style.css'

function Quiz() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const { topicTitle, subtopicTitle, questionCount = 5 } = state ?? {}

  const [phase, setPhase] = useState('loading')
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!topicTitle || !subtopicTitle) {
      navigate('/')
      return
    }
    generateQuiz()
  }, [])

  async function generateQuiz() {
    setPhase('loading')
    try {
      const response = await api.post('/quiz/generate', {
        topicTitle,
        subtopicTitle,
        questionCount,
      })
      setQuestions(response.data.questions)
      setCurrent(0)
      setScore(0)
      setSelected(null)
      setShowFeedback(false)
      setPhase('question')
    } catch (err) {
      const msg = err.response?.data?.error ?? 'Erro ao gerar questões. Verifique sua chave de API.'
      setErrorMsg(msg)
      setPhase('error')
    }
  }

  function handleOptionClick(index) {
    if (showFeedback) return
    setSelected(index)
    setShowFeedback(true)
    if (index === questions[current].correctIndex) {
      setScore(s => s + 1)
    }
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1)
      setSelected(null)
      setShowFeedback(false)
    } else {
      setPhase('result')
    }
  }

  // ── Loading ──
  if (phase === 'loading') {
    return (
      <div className="quiz-page">
        <div className="quiz-container quiz-loading">
          <div className="spinner" />
          <p className="loading-text">Gerando questões com IA…</p>
          <p className="loading-sub">{topicTitle} › {subtopicTitle}</p>
        </div>
      </div>
    )
  }

  // ── Error ──
  if (phase === 'error') {
    return (
      <div className="quiz-page">
        <div className="quiz-container quiz-error-screen">
          <span className="error-icon">⚠️</span>
          <h2>Ocorreu um erro</h2>
          <p>{errorMsg}</p>
          <div className="result-actions">
            <button className="btn-primary" onClick={generateQuiz}>Tentar novamente</button>
            <button className="btn-secondary" onClick={() => navigate('/')}>Voltar</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Result ──
  if (phase === 'result') {
    const pct = Math.round((score / questions.length) * 100)
    const medal = pct === 100 ? '🏆' : pct >= 70 ? '🌟' : pct >= 40 ? '📚' : '💪'
    return (
      <div className="quiz-page">
        <div className="quiz-container result-screen">
          <div className="result-medal">{medal}</div>
          <h2 className="result-title">Quiz finalizado!</h2>
          <p className="result-topic">{topicTitle} › {subtopicTitle}</p>
          <div className="result-score-ring">
            <svg viewBox="0 0 100 100" className="ring-svg">
              <circle className="ring-bg" cx="50" cy="50" r="42" />
              <circle
                className="ring-fill"
                cx="50" cy="50" r="42"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
              />
            </svg>
            <div className="ring-label">
              <span className="ring-pct">{pct}%</span>
              <span className="ring-detail">{score}/{questions.length}</span>
            </div>
          </div>
          <div className="result-actions">
            <button className="btn-primary" onClick={generateQuiz}>Novo Quiz</button>
            <button className="btn-secondary" onClick={() => navigate('/')}>Início</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Question ──
  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        {/* Header */}
        <div className="quiz-header">
          <button className="back-btn" onClick={() => navigate('/')}>←</button>
          <div className="quiz-meta">
            <span className="quiz-topic-badge">{topicTitle}</span>
            <span className="quiz-sub-badge">{subtopicTitle}</span>
          </div>
          <span className="quiz-counter">{current + 1}/{questions.length}</span>
        </div>

        {/* Progress bar */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <div className="question-card">
          <p className="question-text">{q.question}</p>
        </div>

        {/* Options */}
        <div className="options-list">
          {q.options.map((option, idx) => {
            let cls = 'option-btn'
            if (showFeedback) {
              if (idx === q.correctIndex) cls += ' correct'
              else if (idx === selected) cls += ' wrong'
            }
            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleOptionClick(idx)}
                disabled={showFeedback}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{option.replace(/^[A-D]\)\s*/, '')}</span>
                {showFeedback && idx === q.correctIndex && <span className="check-icon">✓</span>}
                {showFeedback && idx === selected && idx !== q.correctIndex && <span className="check-icon">✗</span>}
              </button>
            )
          })}
        </div>

        {/* Feedback / Explanation */}
        {showFeedback && (
          <div className={`feedback-box ${selected === q.correctIndex ? 'feedback-correct' : 'feedback-wrong'}`}>
            <p className="feedback-verdict">
              {selected === q.correctIndex ? '✅ Correto!' : '❌ Incorreto'}
            </p>
            <p className="feedback-explanation">{q.explanation}</p>
            <button className="btn-next" onClick={handleNext}>
              {current + 1 < questions.length ? 'Próxima →' : 'Ver resultado'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz
