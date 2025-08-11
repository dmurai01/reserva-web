// Configurações da API
const API_BASE_URL = 'http://localhost:3000';

// Funções de formatação
const formatCPF = (cpf) => {
    // Remove tudo que não é dígito
    cpf = cpf.replace(/\D/g, '');
    
    // Aplica a máscara
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    return cpf;
};

const formatPhone = (phone) => {
    // Remove tudo que não é dígito
    phone = phone.replace(/\D/g, '');
    
    // Aplica a máscara
    phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
    phone = phone.replace(/(\d{5})(\d)/, '$1-$2');
    
    return phone;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
};

// Funções de validação
const validateCPF = (cpf) => {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
};

const validatePhone = (phone) => {
    // Remove caracteres não numéricos (proteção contra undefined)
    const cleanPhone = (phone || '').replace(/\D/g, '');
    
    // Verifica se tem entre 10 e 11 dígitos (com DDD)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};;

const validateDate = (dateString) => {
    if (!dateString) return false;

    let dateObj;

    // Detecta formato DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split('/').map(Number);
        dateObj = new Date(year, month - 1, day);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        // YYYY-MM-DD sem timezone issues
        const [year, month, day] = dateString.split('-').map(Number);
        dateObj = new Date(year, month - 1, day);
    } else {
        dateObj = new Date(dateString);
    }

    if (isNaN(dateObj.getTime())) return false;

    // Zera horas para comparar apenas datas
    const today = new Date();
    today.setHours(0,0,0,0);
    dateObj.setHours(0,0,0,0);

    return dateObj >= today;
};;

// Funções de manipulação de DOM
const showSection = (sectionId) => {
    // Esconde todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove classe active de todos os botões
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostra a seção selecionada
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    // Adiciona classe active ao botão correspondente
    const btn = document.querySelector(`[onclick*="${sectionId.replace('-section', '')}"]`);
    if (btn) {
        btn.classList.add('active');
    }
};

const showModal = (title, message) => {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal').style.display = 'block';
};

const closeModal = () => {
    document.getElementById('modal').style.display = 'none';
};

const showLoading = () => {
    const el = document.getElementById('loading');
    if (el && el.style) {
        el.style.display = 'flex';
    }
};;

const hideLoading = () => {
    const el = document.getElementById('loading');
    if (el && el.style) {
        el.style.display = 'none';
    }
};;

const clearForm = (formId) => {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        
        // Remove classes de erro
        form.querySelectorAll('.error').forEach(element => {
            element.classList.remove('error');
        });
        
        // Remove mensagens de erro
        form.querySelectorAll('.error-message').forEach(element => {
            element.remove();
        });
        
        // Limpa informações de disponibilidade
        const availabilityInfo = document.getElementById('availability-info');
        if (availabilityInfo) {
            availabilityInfo.innerHTML = '';
            availabilityInfo.className = 'availability-info';
        }
    }
};

const addErrorClass = (element) => {
    element.classList.add('error');
};

const removeErrorClass = (element) => {
    element.classList.remove('error');
};

const showError = (element, message) => {
    // Remove mensagem de erro anterior
    const existingError = element.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Adiciona classe de erro
    addErrorClass(element);
    
    // Cria nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    // Insere após o elemento
    element.parentNode.insertBefore(errorDiv, element.nextSibling);
};

const clearError = (element) => {
    removeErrorClass(element);
    
    const errorMessage = element.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
};

// Funções de armazenamento local
const setLocalStorage = (key, value) => {
    try {
        console.log('💾 Salvando no localStorage:', key, '=', value);
        console.log('💾 Tipo do valor:', typeof value);
        console.log('💾 Valor é truthy?', !!value);
        
        localStorage.setItem(key, JSON.stringify(value));
        console.log('💾 Salvo no localStorage:', key, '=', value ? 'Sim' : 'Não');
        console.log('💾 Valor real:', value);
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
    }
};

const getLocalStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        console.log('🔍 Lendo do localStorage:', key, '=', item);
        if (item === null || item === undefined || item === 'undefined' || item === 'null') {
            return null;
        }
        const parsed = JSON.parse(item);
        console.log('🔍 Valor parseado:', parsed);
        console.log('🔍 Tipo do valor parseado:', typeof parsed);
        return parsed;
    } catch (error) {
        console.error('Erro ao ler do localStorage:', error);
        return null;
    }
};

const removeLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Erro ao remover do localStorage:', error);
    }
};

// Funções de data
const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
};

const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return today.toDateString() === date.toDateString();
};

const isThisWeek = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    const weekDates = getWeekDates();
    return weekDates.includes(dateString);
};

// Funções de formatação de dados para exibição
const formatReservationForDisplay = (reservation) => {
    return {
        ...reservation,
        formattedDate: formatDate(reservation.data || reservation.reservationDate),
        formattedDateTime: formatDateTime(reservation.createdAt || new Date()),
        formattedCPF: formatCPF(reservation.cpf),
        formattedPhone: formatPhone(reservation.celular || reservation.phone)
    };
};

// Funções de ordenação
const sortReservationsByDate = (reservations) => {
    return reservations.sort((a, b) => {
        const dateA = new Date(a.data || a.reservationDate);
        const dateB = new Date(b.data || b.reservationDate);
        return dateA - dateB;
    });
};

const sortReservationsByCreatedAt = (reservations) => {
    return reservations.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.data || a.reservationDate);
        const dateB = new Date(b.createdAt || b.data || b.reservationDate);
        return dateB - dateA; // Mais recentes primeiro
    });
};

// Funções de filtro
const filterReservationsByDate = (reservations, date) => {
    if (!date) return reservations;
    
    return reservations.filter(reservation => 
        reservation.data === date || reservation.reservationDate === date
    );
};

const filterReservationsByCPF = (reservations, cpf) => {
    if (!cpf) return reservations;
    
    const cleanCPF = cpf.replace(/\D/g, '');
    return reservations.filter(reservation => {
        const reservationCPF = reservation.cpf || '';
        return reservationCPF.replace(/\D/g, '') === cleanCPF;
    });
};

// Funções de estatísticas
const calculateStats = (reservations) => {
    const today = getToday();
    const weekDates = getWeekDates();
    
    const todayReservations = reservations.filter(r => (r.data || r.reservationDate) === today).length;
    const weekReservations = reservations.filter(r => weekDates.includes(r.data || r.reservationDate)).length;
    const totalClients = new Set(reservations.map(r => r.cpf)).size;
    
    return {
        todayReservations,
        weekReservations,
        totalClients
    };
};

// Funções de validação de formulário
const validateReservationForm = (formData) => {
    const errors = [];
    
    const fullName = formData.fullName || formData.nome || '';
    const cpf = formData.cpf || '';
    const phone = formData.phone || formData.celular || '';
    const peopleCount = parseInt(formData.peopleCount || formData.quantidadePessoas || '0', 10);
    const reservationDate = formData.reservationDate || formData.data || '';
    
    // Validação do nome
    if (!fullName || fullName.trim().length < 3) {
        errors.push('Nome completo deve ter pelo menos 3 caracteres');
    }
    
    // Validação do CPF
    if (!validateCPF(cpf)) {
        errors.push('CPF inválido');
    }
    
    // Validação do telefone
    if (!validatePhone(phone)) {
        errors.push('Telefone inválido (deve incluir DDD)');
    }
    
    // Validação da quantidade de pessoas
    if (!peopleCount || peopleCount < 1 || peopleCount > 4) {
        errors.push('Quantidade de pessoas deve ser entre 1 e 4');
    }
    
    // Validação da data
    if (!validateDate(reservationDate)) {
        errors.push('Data da reserva deve ser hoje ou uma data futura');
    }
    
    return errors;
};

// Funções de debounce para otimização
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Exportar funções para uso global
window.utils = {
    formatCPF,
    formatPhone,
    formatDate,
    formatDateTime,
    validateCPF,
    validatePhone,
    validateDate,
    showSection,
    showModal,
    closeModal,
    showLoading,
    hideLoading,
    clearForm,
    addErrorClass,
    removeErrorClass,
    showError,
    clearError,
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage,
    getToday,
    getWeekDates,
    isToday,
    isThisWeek,
    formatReservationForDisplay,
    sortReservationsByDate,
    sortReservationsByCreatedAt,
    filterReservationsByDate,
    filterReservationsByCPF,
    calculateStats,
    validateReservationForm,
    debounce,
    API_BASE_URL
}; 