import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import api from '../../services/api'

function Settings() {
  const [topics, setTopics] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState([])
  const [confirm, setConfirm] = useState(null)

  const [editingTopicId, setEditingTopicId] = useState(null)
  const [editingSubtopicId, setEditingSubtopicId] = useState(null)

  const [newTopicTitle, setNewTopicTitle] = useState('')
  const [newTopicArea, setNewTopicArea] = useState('')
  const [addingTopic, setAddingTopic] = useState(false)
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('')
  const [addingSubtopicFor, setAddingSubtopicFor] = useState(null)

  const navigate = useNavigate()

  function toast(message, type = 'success') {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }

  async function loadTopics() {
    try {
      const res = await api.get('/topics')
      setTopics(res.data)
    } catch {
      toast('Erro ao carregar tópicos', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTopics() }, [])

  async function handleCreateTopic() {
    if (!newTopicTitle.trim()) return
    try {
      await api.post('/topics', { title: newTopicTitle.trim(), area: newTopicArea.trim() || undefined })
      setNewTopicTitle(''); setNewTopicArea(''); setAddingTopic(false)
      toast('Tópico criado!')
      loadTopics()
    } catch (e) {
      toast(e.response?.data?.error || 'Erro ao criar tópico', 'error')
    }
  }

  async function handleUpdateTopic(id, title, area) {
    try {
      await api.put(`/topics/${id}`, { title, area })
      setEditingTopicId(null)
      toast('Tópico atualizado!')
      loadTopics()
    } catch (e) {
      toast(e.response?.data?.error || 'Erro ao atualizar', 'error')
    }
  }

  function handleDeleteTopic(topic) {
    setConfirm({
      message: `Remover "${topic.title}" e todos os seus subtópicos?`,
      onConfirm: async () => {
        setConfirm(null)
        try {
          await api.delete(`/topics/${topic.id}`)
          toast('Tópico removido!')
          loadTopics()
        } catch (e) {
          toast(e.response?.data?.error || 'Erro ao remover', 'error')
        }
      },
      onCancel: () => setConfirm(null),
    })
  }

  async function handleCreateSubtopic(topicId) {
    if (!newSubtopicTitle.trim()) return
    try {
      await api.post(`/subtopics/${topicId}/subtopics`, { title: newSubtopicTitle.trim() })
      setNewSubtopicTitle(''); setAddingSubtopicFor(null)
      toast('Subtópico criado!')
      loadTopics()
    } catch (e) {
      toast(e.response?.data?.error || 'Erro ao criar subtópico', 'error')
    }
  }

  async function handleUpdateSubtopic(topicId, subtopicId, title) {
    try {
      await api.put(`/subtopics/${topicId}/${subtopicId}`, { title })
      setEditingSubtopicId(null)
      toast('Subtópico atualizado!')
      loadTopics()
    } catch (e) {
      toast(e.response?.data?.error || 'Erro ao atualizar', 'error')
    }
  }

  function handleDeleteSubtopic(topicId, subtopic) {
    setConfirm({
      message: `Remover subtópico "${subtopic.title}"?`,
      onConfirm: async () => {
        setConfirm(null)
        try {
          await api.delete(`/subtopics/${topicId}/${subtopic.id}`)
          toast('Subtópico removido!')
          loadTopics()
        } catch (e) {
          toast(e.response?.data?.error || 'Erro ao remover', 'error')
        }
      },
      onCancel: () => setConfirm(null),
    })
  }

  return (
    <div className="container">

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' ? '✓' : '✕'} {t.message}
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirm && (
        <div className="settings-overlay">
          <div className="settings-dialog">
            <p className="settings-dialog-msg">{confirm.message}</p>
            <div className="settings-dialog-actions">
              <button className="settings-btn-ghost" onClick={confirm.onCancel}>Cancelar</button>
              <button className="settings-btn-danger" onClick={confirm.onConfirm}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <div className="home-page">

        {/* Header — mesmo padrão da Home */}
        <header className="home-header">
          <h1>Configurações</h1>
          <p>Gerencie tópicos e subtópicos</p>
        </header>

        {/* Actions row */}
        <div className="settings-top-row">
          <button className="settings-btn-back" onClick={() => navigate('/')}>
            ← Voltar
          </button>
          <button
            className="startBttn"
            style={{ marginTop: 0, width: 'auto', padding: '10px 20px', fontSize: '0.9rem' }}
            onClick={() => setAddingTopic(true)}
          >
            + Novo Tópico
          </button>
        </div>

        {/* Add topic form */}
        {addingTopic && (
          <div className="settings-add-card">
            <span className="settings-add-label">Novo tópico</span>
            <input
              autoFocus
              className="settings-input"
              placeholder="Título *"
              value={newTopicTitle}
              onChange={e => setNewTopicTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateTopic()}
            />
            <input
              className="settings-input"
              placeholder="Área (opcional)"
              value={newTopicArea}
              onChange={e => setNewTopicArea(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateTopic()}
            />
            <div className="settings-add-btns">
              <button
                className="startBttn"
                style={{ marginTop: 0, width: 'auto', padding: '10px 20px', fontSize: '0.9rem' }}
                onClick={handleCreateTopic}
              >
                Criar
              </button>
              <button className="settings-btn-ghost" onClick={() => { setAddingTopic(false); setNewTopicTitle(''); setNewTopicArea('') }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="subtopic-panel settings-empty">Carregando...</div>
        ) : topics.length === 0 ? (
          <div className="subtopic-panel settings-empty">Nenhum tópico cadastrado.</div>
        ) : (
          <div className="settings-topic-list">
            {topics.map(topic => {
              const isExpanded = expandedId === topic.id
              const isEditingTopic = editingTopicId === topic.id

              return (
                <div key={topic.id} className="settings-topic-card">

                  {/* Topic row */}
                  <div className="settings-topic-row">
                    <button
                      className="settings-expand-btn"
                      onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                    >
                      <span className={`settings-chevron ${isExpanded ? 'open' : ''}`}>›</span>
                    </button>

                    {isEditingTopic ? (
                      <TopicEditForm
                        topic={topic}
                        onSave={(title, area) => handleUpdateTopic(topic.id, title, area)}
                        onCancel={() => setEditingTopicId(null)}
                      />
                    ) : (
                      <div className="settings-topic-info">
                        <span className="settings-topic-title">{topic.title}</span>
                        {topic.area && <span className="settings-area-badge">{topic.area}</span>}
                        <span className="settings-count-badge">{topic.subtopics?.length ?? 0} subtópicos</span>
                      </div>
                    )}

                    {!isEditingTopic && (
                      <div className="settings-row-actions">
                        <button className="settings-btn-edit" onClick={() => setEditingTopicId(topic.id)}>Editar</button>
                        <button className="settings-btn-remove" onClick={() => handleDeleteTopic(topic)}>Remover</button>
                      </div>
                    )}
                  </div>

                  {/* Subtopics panel — reusa .subtopic-panel da Home */}
                  {isExpanded && (
                    <div className="subtopic-panel settings-subtopic-area">
                      {topic.subtopics?.map(sub => (
                        <div key={sub.id} className="settings-subtopic-row">
                          {editingSubtopicId === sub.id ? (
                            <InlineEdit
                              value={sub.title}
                              onSave={val => handleUpdateSubtopic(topic.id, sub.id, val)}
                              onCancel={() => setEditingSubtopicId(null)}
                            />
                          ) : (
                            <>
                              <span className="subtopic-chip settings-subtopic-label">{sub.title}</span>
                              <div className="settings-row-actions">
                                <button className="settings-btn-edit" onClick={() => setEditingSubtopicId(sub.id)}>Editar</button>
                                <button className="settings-btn-remove" onClick={() => handleDeleteSubtopic(topic.id, sub)}>✕</button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}

                      {addingSubtopicFor === topic.id ? (
                        <div className="settings-add-subtopic-row">
                          <input
                            autoFocus
                            className="settings-input"
                            placeholder="Nome do subtópico"
                            value={newSubtopicTitle}
                            onChange={e => setNewSubtopicTitle(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleCreateSubtopic(topic.id)
                              if (e.key === 'Escape') { setAddingSubtopicFor(null); setNewSubtopicTitle('') }
                            }}
                          />
                          <button className="settings-btn-confirm" onClick={() => handleCreateSubtopic(topic.id)}>✓</button>
                          <button className="settings-btn-remove" onClick={() => { setAddingSubtopicFor(null); setNewSubtopicTitle('') }}>✕</button>
                        </div>
                      ) : (
                        <button
                          className="settings-add-subtopic-btn"
                          onClick={() => { setAddingSubtopicFor(topic.id); setNewSubtopicTitle('') }}
                        >
                          + Adicionar subtópico
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function TopicEditForm({ topic, onSave, onCancel }) {
  const [title, setTitle] = useState(topic.title)
  const [area, setArea] = useState(topic.area || '')
  return (
    <div className="settings-inline-edit">
      <input className="settings-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
      <input className="settings-input settings-input-sm" value={area} onChange={e => setArea(e.target.value)} placeholder="Área" />
      <button className="settings-btn-confirm" onClick={() => onSave(title, area)}>✓</button>
      <button className="settings-btn-remove" onClick={onCancel}>✕</button>
    </div>
  )
}

function InlineEdit({ value, onSave, onCancel }) {
  const [val, setVal] = useState(value)
  return (
    <div className="settings-inline-edit">
      <input
        autoFocus
        className="settings-input"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') onSave(val)
          if (e.key === 'Escape') onCancel()
        }}
      />
      <button className="settings-btn-confirm" onClick={() => onSave(val)}>✓</button>
      <button className="settings-btn-remove" onClick={onCancel}>✕</button>
    </div>
  )
}

export default Settings
