// Classe para gerenciar todas as chamadas da API
class API {
    constructor(baseURL = utils.API_BASE_URL) {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    // Método genérico para fazer requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // Adiciona token de autenticação se disponível
        const headers = { ...this.defaultHeaders, ...options.headers };
        const adminToken = utils.getLocalStorage('adminToken');
        console.log('🔍 Token para endpoint', endpoint, ':', adminToken);
        console.log('🔍 Tipo do token:', typeof adminToken);
        console.log('🔍 Token é string?', typeof adminToken === 'string');
        console.log('🔍 Token é truthy?', !!adminToken);
        
        if (adminToken && typeof adminToken === 'string' && adminToken.length > 0) {
            headers['Authorization'] = `Bearer ${adminToken}`;
            console.log('🔐 Token enviado:', adminToken.substring(0, 20) + '...');
        } else {
            console.log('⚠️ Nenhum token encontrado para:', endpoint);
        }
        
        const config = {
            headers,
            ...options
        };

        try {
            utils.showLoading();
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                // Só não loga erro 401 se não há token (situação normal)
                if (response.status !== 401 || !adminToken) {
                    console.error('❌ Erro HTTP:', response.status, errorData);
                }
                
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            // Só não loga erro de token não fornecido se não há token (situação normal)
            if (!error.message.includes('Token de acesso não fornecido') || !adminToken) {
                console.error('❌ API Error:', error);
            }
            
            return { 
                success: false, 
                error: error.message || 'Erro na comunicação com o servidor' 
            };
        } finally {
            utils.hideLoading();
        }
    }

    // Método GET
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // Método POST
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Método PUT
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Método DELETE
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Instância global da API
const api = new API();

// Funções específicas para reservas
class ReservationAPI {
    // Criar nova reserva
    static async createReservation(reservationData) {
        return api.post('/api/reservas', reservationData);
    }

    // Verificar se CPF tem reserva ativa
    static async checkCPFActiveReservation(cpf) {
        const cleanCPF = cpf.replace(/\D/g, '');
        return api.get(`/api/reservas/verificar/${cleanCPF}`);
    }
}

// Funções para verificação de disponibilidade
class AvailabilityAPI {
    // Verificar disponibilidade de datas
    static async checkAvailability(date) {
        const endpoint = date ? `/api/reservas/disponibilidade?data=${date}` : '/api/reservas/disponibilidade';
        return api.get(endpoint);
    }

    // Buscar todas as datas disponíveis
    static async getAvailableDates() {
        return api.get('/api/reservas/disponibilidade');
    }

    // Buscar datas indisponíveis
    static async getUnavailableDates() {
        return api.get('/api/reservas/disponibilidade');
    }
}

// Funções para autenticação administrativa
class AdminAPI {
    // Login do administrador
    static async login(credentials) {
        return api.post('/api/admin/login', credentials);
    }

    // Buscar todas as reservas (para administrador)
    static async getAllReservations() {
        return api.get('/api/admin/reservas');
    }

    // Buscar reservas por data (para administrador)
    static async getReservationsByDate(date) {
        return api.get(`/api/admin/reservas/${date}`);
    }

    // Buscar estatísticas
    static async getStats() {
        return api.get('/api/admin/estatisticas');
    }
}



// Exportar todas as classes para uso global
window.API = API;
window.ReservationAPI = ReservationAPI;
window.AvailabilityAPI = AvailabilityAPI;
window.AdminAPI = AdminAPI;
window.api = api; 