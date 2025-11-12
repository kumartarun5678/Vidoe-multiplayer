import { API_BASE_URL } from '../utils/constants';

class ApiService {
  async get(url) {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post(url, data) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getGridState() {
    return this.get('/grid/state');
  }

  async updateCell(x, y, char, sessionId) {
    return this.post('/grid/update', { x, y, char, sessionId });
  }

  async getOnlineCount() {
    return this.get('/players/count');
  }

  async getSessionStatus(sessionId) {
    return this.get(`/players/session/${sessionId}`);
  }

  async getHistory() {
    return this.get('/history');
  }

  async getGroupedHistory() {
    return this.get('/history/grouped');
  }
}

export const apiService = new ApiService();