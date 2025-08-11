// Classe principal da aplicação
class ReservationApp {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupDateInput();
        this.checkAdminSession();
        await this.loadInitialData();
        
        // Sempre mostra o formulário de reserva por padrão
        this.showReservationForm();
    }

    setupEventListeners() {
        // Formulário de reserva
        const reservationForm = document.getElementById('reservation-form');
        if (reservationForm) {
            reservationForm.addEventListener('submit', (e) => this.handleReservationSubmit(e));
        }

        // Formulário de login administrativo
        const adminForm = document.getElementById('admin-form');
        if (adminForm) {
            adminForm.addEventListener('submit', (e) => this.handleAdminLogin(e));
        }

        // Navegação principal
        const btnReservation = document.getElementById('btn-reservation');
        if (btnReservation) {
            btnReservation.addEventListener('click', () => this.showReservationForm());
        }

        const btnAdmin = document.getElementById('btn-admin');
        if (btnAdmin) {
            btnAdmin.addEventListener('click', () => this.showAdminLogin());
        }

        // Botões do painel administrativo
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => this.logout());
        }

        const btnFilter = document.getElementById('btn-filter');
        if (btnFilter) {
            btnFilter.addEventListener('click', () => this.loadReservations());
        }

        // Botões do modal
        const btnCloseModal = document.getElementById('btn-close-modal');
        if (btnCloseModal) {
            btnCloseModal.addEventListener('click', () => utils.closeModal());
        }

        const btnCloseModalFooter = document.getElementById('btn-close-modal-footer');
        if (btnCloseModalFooter) {
            btnCloseModalFooter.addEventListener('click', () => utils.closeModal());
        }

        // Fechar modal ao clicar fora
        const modal = document.getElementById('modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    utils.closeModal();
                }
            });
        }

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                utils.closeModal();
            }
        });
    }

    setupDateInput() {
        const dateInput = document.getElementById('reservationDate');
        if (dateInput) {
            // Define data mínima como hoje
            const today = utils.getToday();
            dateInput.min = today;
            dateInput.value = today;
        }
    }

    async checkAdminSession() {
        // Verificação de sessão será feita através do localStorage
        const adminToken = utils.getLocalStorage('adminToken');
        if (adminToken) {
            this.isAdmin = true;
            // Não mostra o painel administrativo automaticamente
            // Só será mostrado quando o usuário clicar no botão "Administrador"
        }
    }

    async loadInitialData() {
        // Não carrega dados administrativos automaticamente
        // Os dados só serão carregados quando o usuário acessar o painel administrativo
    }

    // Handlers de formulários
    async handleReservationSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const reservationData = {
            nome: formData.get('fullName').trim(),
            cpf: formData.get('cpf').replace(/\D/g, ''),
            celular: formData.get('phone').replace(/\D/g, ''),
            quantidadePessoas: parseInt(formData.get('peopleCount')),
            data: formData.get('reservationDate')
        };

        // Validação do formulário
        const validation = await ReservationValidator.validateReservation(reservationData);
        
        if (!validation.valid) {
            if (window.formValidator) {
                window.formValidator.clearAllErrors();
                window.formValidator.highlightErrors(validation.errors);
            }
            return;
        }

        // Envio da reserva
        try {
            const response = await ReservationAPI.createReservation(reservationData);
            
            if (response.success) {
                document.getElementById('reserva-success').textContent = 'Reserva confirmada com sucesso!';
                utils.clearForm('reservation-form');
                this.setupDateInput();
            } else {
                document.getElementById('reserva-error').textContent = response.error || 'Erro ao criar reserva';
            }
        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            document.getElementById('reserva-error').textContent = 'Erro interno do sistema. Tente novamente.';
        }
    }

    async handleAdminLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const credentials = {
            username: formData.get('adminUser').trim(),
            password: formData.get('adminPassword')
        };

        // Validação básica
        const validation = AdminValidator.validateLogin(credentials);
        if (!validation.valid) {
            if (window.formValidator) {
                window.formValidator.clearAllErrors();
                window.formValidator.highlightErrors(validation.errors);
            }
            return;
        }

        try {
            console.log('🔍 Tentando fazer login com:', credentials);
            const response = await AdminAPI.login(credentials);
            console.log('🔍 Resposta do login:', response);
            
            // Verifica se o login foi bem-sucedido
            if (response.success) {
                console.log('✅ Login bem-sucedido');
                this.isAdmin = true;
                this.currentUser = response.data.admin;
                
                // Debug: verifica a estrutura da resposta
                console.log('🔍 Resposta completa:', response);
                console.log('🔍 response.data:', response.data);
                
                // Verifica se response.data é uma string (pode ser o token diretamente)
                if (typeof response.data === 'string') {
                    console.log('🔍 response.data é string (token direto):', response.data);
                    utils.setLocalStorage('adminToken', response.data);
                } else {
                    console.log('🔍 response.data.token:', response.data.token);
                    console.log('🔍 response.data.accessToken:', response.data.accessToken);
                    console.log('🔍 response.data.jwt:', response.data.jwt);
                    console.log('🔍 response.data.access_token:', response.data.access_token);
                    console.log('🔍 response.data.data.token:', response.data.data?.token);
                    
                    // Tenta diferentes possíveis campos do token
                    const token = response.data.token || response.data.accessToken || response.data.jwt || response.data.access_token || response.data.data?.token;
                    console.log('🔍 Token encontrado:', token);
                    
                    if (!token) {
                        console.error('❌ Nenhum token encontrado na resposta');
                        utils.showModal('Erro', 'Token de autenticação não encontrado na resposta da API');
                        return;
                    }
                    
                    // Salva o token primeiro
                    utils.setLocalStorage('adminToken', token);
                }
                
                // Aguarda um momento para garantir que o token foi salvo
                await new Promise(resolve => setTimeout(resolve, 200));
                
                // Verifica se o token foi salvo corretamente
                const savedToken = utils.getLocalStorage('adminToken');
                console.log('🔍 Token salvo:', savedToken ? 'Sim' : 'Não');
                console.log('🔍 Token valor:', savedToken);
                
                if (!savedToken) {
                    console.error('❌ Token não foi salvo corretamente');
                    utils.showModal('Erro', 'Falha ao salvar token de autenticação');
                    return;
                }
                
                utils.showModal('Sucesso', 'Login realizado com sucesso!');
                this.showAdminPanel();
                
                // Carrega os dados administrativos após o token estar disponível
                await this.loadAdminData();
            } else {
                console.log('❌ Login falhou');
                console.log('❌ response.success:', response.success);
                console.log('❌ response.data:', response.data);
                utils.showModal('Erro de Login', response.error || 'Credenciais inválidas');
            }
        } catch (error) {
            console.error('❌ Erro no login:', error);
            console.error('❌ Stack trace:', error.stack);
            console.error('❌ Tipo do erro:', typeof error);
            console.error('❌ Mensagem do erro:', error.message);
            document.getElementById('reserva-error').textContent = 'Erro interno do sistema. Tente novamente.';
        }
    }

    // Navegação
    showReservationForm() {
        utils.showSection('reservation-section');
    }

    showAdminLogin() {
        // Se já há um token válido, vai direto para o painel administrativo
        const adminToken = utils.getLocalStorage('adminToken');
        if (adminToken) {
            this.isAdmin = true;
            this.showAdminPanel();
            this.loadAdminData();
        } else {
            utils.showSection('admin-section');
        }
    }

    showAdminPanel() {
        utils.showSection('admin-panel');
    }

    async logout() {
        try {
            await AdminAPI.logout();
        } catch (error) {
            console.error('Erro no logout:', error);
        }
        
        this.isAdmin = false;
        this.currentUser = null;
        utils.removeLocalStorage('adminToken');
        this.showReservationForm();
    }

    // Carregamento de dados administrativos
    async loadAdminData() {
        await Promise.all([
            this.loadStats(),
            this.loadReservations()
        ]);
    }

    async loadStats() {
        try {
            const response = await AdminAPI.getStats();
            if (response.success) {
                this.updateStatsDisplay(response.data.data);
            } else if (response.error && response.error.includes('Token de acesso não fornecido')) {
                // Ignora erro de token não fornecido (situação normal no início)
                return;
            } else {
                console.error('❌ Erro ao carregar estatísticas:', response.error);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar estatísticas:', error);
        }
    }

    async loadReservations(filters = {}) {
        try {
            let response;
            if (filters.date) {
                response = await AdminAPI.getReservationsByDate(filters.date);
            } else {
                response = await AdminAPI.getAllReservations();
            }
            
            if (response.success) {
                const reservations = response.data.data?.reservas;

                if (!reservations || !Array.isArray(reservations)) {
                    this.displayReservations([], filters);
                    return;
                }
            
                this.displayReservations(reservations, filters);
            }
             else if (response.error && response.error.includes('Token de acesso não fornecido')) {
                // Ignora erro de token não fornecido (situação normal no início)
                return;
            } else {
                console.error('❌ Erro na API:', response.error);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar reservas:', error);
        }
    }

    // Atualização da interface
    updateStatsDisplay(stats) {
        document.getElementById('today-reservations').textContent = stats.reservasHoje || 0;
        document.getElementById('week-reservations').textContent = stats.totalReservas || 0;
        document.getElementById('total-clients').textContent = stats.totalReservas || 0;
    }

    displayReservations(reservations, filters = {}) {
        const container = document.getElementById('reservations-list');
        if (!container) {
            console.error('❌ Container de reservas não encontrado');
            return;
        }

        // Garante que reservations seja um array
        if (!reservations || !Array.isArray(reservations)) {
            console.error('❌ Reservas não é um array:', reservations);
            reservations = [];
        }

        // Aplica filtros
        let filteredReservations = reservations;
        
        if (filters.date) {
            filteredReservations = utils.filterReservationsByDate(filteredReservations, filters.date);
        }
        
        if (filters.cpf) {
            filteredReservations = utils.filterReservationsByCPF(filteredReservations, filters.cpf);
        }

        // Ordena por data de criação (mais recentes primeiro)
        filteredReservations = utils.sortReservationsByCreatedAt(filteredReservations);

        if (filteredReservations.length === 0) {
            container.innerHTML = `
                <div class="no-reservations">
                    <i class="fas fa-inbox"></i>
                    <p>Nenhuma reserva encontrada</p>
                </div>
            `;
            return;
        }

        const reservationsHTML = filteredReservations.map(reservation => {
            return `
                <div class="reservation-item">
                    <div class="reservation-header">
                        <span class="reservation-name">${reservation.nome}</span>
                        <span class="reservation-date">${reservation.data}</span>
                    </div>
                    <div class="reservation-details">
                        <div class="detail-item">
                            <span class="detail-label">CPF</span>
                            <span class="detail-value">${reservation.cpf}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Telefone</span>
                            <span class="detail-value">${reservation.celular}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Pessoas</span>
                            <span class="detail-value">${reservation.quantidadePessoas}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Criado em</span>
                            <span class="detail-value">${reservation.createdAt ? new Date(reservation.createdAt).toLocaleString('pt-BR') : 'N/A'}</span>
                        </div>
                    </div>
                    <div class="reservation-actions">
                        <button onclick="app.cancelReservation('${reservation.id}')" class="btn-cancel">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = reservationsHTML;
    }

    // Ações administrativas
    async cancelReservation(reservationId) {
        if (!confirm('Tem certeza que deseja cancelar esta reserva?')) {
            return;
        }

        // Como a API não tem endpoint de cancelamento, vamos apenas mostrar uma mensagem
        utils.showModal('Informação', 'Funcionalidade de cancelamento não disponível na API atual');
    }

    async exportReservations(format = 'csv') {
        // Como a API não tem endpoint de exportação, vamos apenas mostrar uma mensagem
        utils.showModal('Informação', 'Funcionalidade de exportação não disponível na API atual');
    }

    // Funções auxiliares
    async checkDateAvailability(date) {
        try {
            const response = await AvailabilityAPI.checkAvailability(date);
            if (response.success) {
                return response.data;
            }
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
        }
        return null;
    }

    // Funções de filtro
    async applyFilters() {
        const filterDate = document.getElementById('filter-date').value;
        const filters = {};
        
        if (filterDate) {
            filters.date = filterDate;
        }

        await this.loadReservations(filters);
    }

    clearFilters() {
        document.getElementById('filter-date').value = '';
        this.loadReservations();
    }
}

// Funções globais para uso nos botões HTML (removidas - agora usando event listeners)

// Inicialização da aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ReservationApp();
});

// Funções para verificação de disponibilidade em tempo real
const debouncedAvailabilityCheck = utils.debounce(async (date) => {
    if (date && window.app) {
        const availability = await window.app.checkDateAvailability(date);
        if (availability) {
            const availabilityInfo = document.getElementById('availability-info');
            if (availabilityInfo) {
                if (availability.disponivel) {
                    availabilityInfo.innerHTML = `<i class="fas fa-check-circle"></i> ${availability.mesasDisponiveis} mesa(s) disponível(is) para esta data`;
                    availabilityInfo.className = 'availability-info available';
                } else {
                    availabilityInfo.innerHTML = `<i class="fas fa-times-circle"></i> Não há mesas disponíveis para esta data`;
                    availabilityInfo.className = 'availability-info unavailable';
                }
            }
        }
    }
}, 500);

// Adicionar listener para verificação de disponibilidade
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('reservationDate');
    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            debouncedAvailabilityCheck(e.target.value);
        });
    }
});

// Funções para melhorar a experiência do usuário
function enhanceUserExperience() {
    // Auto-focus no primeiro campo
    const firstInput = document.querySelector('input[type="text"]');
    if (firstInput) {
        firstInput.focus();
    }

    // Adicionar atalhos de teclado
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter para submeter formulário
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activeForm = document.querySelector('form:focus-within');
            if (activeForm) {
                activeForm.dispatchEvent(new Event('submit'));
            }
        }

        // Tab para navegar entre campos
        if (e.key === 'Tab') {
            const inputs = document.querySelectorAll('input, select, button');
            const currentIndex = Array.from(inputs).indexOf(document.activeElement);
            
            if (e.shiftKey) {
                // Tab reverso
                if (currentIndex > 0) {
                    inputs[currentIndex - 1].focus();
                }
            } else {
                // Tab normal
                if (currentIndex < inputs.length - 1) {
                    inputs[currentIndex + 1].focus();
                }
            }
        }
    });
}

// Inicializar melhorias de UX
document.addEventListener('DOMContentLoaded', enhanceUserExperience);

// Funções para tratamento de erros globais
window.addEventListener('error', (event) => {
    console.error('Erro global:', event.error);
    utils.showModal('Erro do Sistema', 'Ocorreu um erro inesperado. Por favor, recarregue a página.');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejeitada não tratada:', event.reason);
    utils.showModal('Erro do Sistema', 'Ocorreu um erro inesperado. Por favor, recarregue a página.');
});

// Funções para verificação de conectividade
function checkConnectivity() {
    if (!navigator.onLine) {
        utils.showModal('Sem Conexão', 'Você está offline. Algumas funcionalidades podem não estar disponíveis.');
    }
}

window.addEventListener('online', () => {
    utils.showModal('Conexão Restaurada', 'Sua conexão foi restaurada. Todas as funcionalidades estão disponíveis.');
});

window.addEventListener('offline', checkConnectivity);

// Verificar conectividade inicial
document.addEventListener('DOMContentLoaded', checkConnectivity);

// Novos manipuladores de formulário para reserva, consulta e disponibilidade
// ...existing code...
// Removido duplicidade de listeners. Os listeners já são configurados na classe ReservationApp.
// ...existing code...