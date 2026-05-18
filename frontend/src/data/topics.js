import api from "../services/api";

const topics = await fetchTopics();

async function fetchTopics() {
  try {
    const response = await api.get('/topics');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tópicos:', error);
    return [];
  }
}

export default topics;