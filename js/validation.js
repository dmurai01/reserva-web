// Configurações de validação
const VALIDATION_CONFIG = {
    MIN_NAME_LENGTH: 3,
    MAX_NAME_LENGTH: 100,
    MIN_PEOPLE: 1,
    MAX_PEOPLE: 4,
    MAX_RESERVATIONS_PER_DAY: 5
};

// Validação em tempo real dos campos
class FormValidator {
    constructor() {
        this.setupValidation();
    }

    setupValidation() {
        // Validação do CPF
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                this.validateCPFField(e.target);
            });
            
            cpfInput.addEventListener('blur', (e) => {
                this.validateCPFField(e.target, true);
            });
        }

        // Validação do telefone
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.validatePhoneField(e.target);
            });
            
            phoneInput.addEventListener('blur', (e) => {
                this.validatePhoneField(e.target, true);
            });
        }

        // Validação do nome
        const nameInput = document.getElementById('fullName');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.validateNameField(e.target);
            });
            
            nameInput.addEventListener('blur', (e) => {
                this.validateNameField(e.target, true);
            });
        }

        // Validação da quantidade de pessoas
        const peopleSelect = document.getElementById('peopleCount');
        if (peopleSelect) {
            peopleSelect.addEventListener('change', (e) => {
                this.validatePeopleField(e.target);
            });
        }

        // Validação da data
        const dateInput = document.getElementById('reservationDate');
        if (dateInput) {
            dateInput.addEventListener('change', (e) => {
                this.validateDateField(e.target);
            });
        }
    }

    validateCPFField(input, showError = false) {
        const value = input.value;
        const cleanValue = value.replace(/\D/g, '');
        
        // Aplica máscara
        let formattedValue = cleanValue;
        if (cleanValue.length > 0) {
            formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2');
            formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2');
            formattedValue = formattedValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        
        input.value = formattedValue;
        
        if (showError && cleanValue.length > 0) {
            if (!utils.validateCPF(formattedValue)) {
                utils.showError(input, 'CPF inválido');
                return false;
            } else {
                utils.clearError(input);
            }
        }
        
        return true;
    }

    validatePhoneField(input, showError = false) {
        const value = input.value;
        const cleanValue = value.replace(/\D/g, '');
        
        // Aplica máscara
        let formattedValue = cleanValue;
        if (cleanValue.length > 0) {
            formattedValue = formattedValue.replace(/(\d{2})(\d)/, '($1) $2');
            formattedValue = formattedValue.replace(/(\d{5})(\d)/, '$1-$2');
        }
        
        input.value = formattedValue;
        
        if (showError && cleanValue.length > 0) {
            if (!utils.validatePhone(formattedValue)) {
                utils.showError(input, 'Telefone inválido (deve incluir DDD)');
                return false;
            } else {
                utils.clearError(input);
            }
        }
        
        return true;
    }

    validateNameField(input, showError = false) {
        const value = input.value.trim();
        
        if (showError && value.length > 0) {
            if (value.length < VALIDATION_CONFIG.MIN_NAME_LENGTH) {
                utils.showError(input, `Nome deve ter pelo menos ${VALIDATION_CONFIG.MIN_NAME_LENGTH} caracteres`);
                return false;
            } else if (value.length > VALIDATION_CONFIG.MAX_NAME_LENGTH) {
                utils.showError(input, `Nome deve ter no máximo ${VALIDATION_CONFIG.MAX_NAME_LENGTH} caracteres`);
                return false;
            } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
                utils.showError(input, 'Nome deve conter apenas letras e espaços');
                return false;
            } else {
                utils.clearError(input);
            }
        }
        
        return true;
    }

    validatePeopleField(input, showError = false) {
        const value = parseInt(input.value);
        
        if (showError && input.value !== '') {
            if (value < VALIDATION_CONFIG.MIN_PEOPLE || value > VALIDATION_CONFIG.MAX_PEOPLE) {
                utils.showError(input, `Quantidade de pessoas deve ser entre ${VALIDATION_CONFIG.MIN_PEOPLE} e ${VALIDATION_CONFIG.MAX_PEOPLE}`);
                return false;
            } else {
                utils.clearError(input);
            }
        }
        
        return true;
    }

    validateDateField(input, showError = false) {
        const value = input.value;
        
        if (showError && value) {
            if (!utils.validateDate(value)) {
                utils.showError(input, 'Data da reserva deve ser hoje ou uma data futura');
                return false;
            } else {
                utils.clearError(input);
                // Verifica disponibilidade da data
                this.checkDateAvailability(value);
            }
        }
        
        return true;
    }

    async checkDateAvailability(date) {
        try {
            const endpoint = date ? `/api/reservas/disponibilidade?data=${date}` : '/api/reservas/disponibilidade';
            const response = await fetch(`${utils.API_BASE_URL}${endpoint}`);
            const data = await response.json();
            
            const availabilityInfo = document.getElementById('availability-info');
            if (availabilityInfo && data.success) {
                if (Array.isArray(data.data)) {
                    // Retorna array de disponibilidades
                    const availability = data.data.find(item => item.dataISO === date);
                    if (availability) {
                        if (availability.disponivel) {
                            availabilityInfo.innerHTML = `<i class="fas fa-check-circle"></i> ${availability.mesasDisponiveis} mesa(s) disponível(is) para esta data`;
                            availabilityInfo.className = 'availability-info available';
                        } else {
                            availabilityInfo.innerHTML = `<i class="fas fa-times-circle"></i> Não há mesas disponíveis para esta data`;
                            availabilityInfo.className = 'availability-info unavailable';
                        }
                    }
                } else {
                    // Retorna disponibilidade única
                    const availability = data.data;
                    if (availability.disponivel) {
                        availabilityInfo.innerHTML = `<i class="fas fa-check-circle"></i> ${availability.mesasDisponiveis} mesa(s) disponível(is) para esta data`;
                        availabilityInfo.className = 'availability-info available';
                    } else {
                        availabilityInfo.innerHTML = `<i class="fas fa-times-circle"></i> Não há mesas disponíveis para esta data`;
                        availabilityInfo.className = 'availability-info unavailable';
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
        }
    }

    validateForm(formData) {
        const errors = [];
        
        // Validação do nome
        if (!formData.fullName || formData.fullName.trim().length < VALIDATION_CONFIG.MIN_NAME_LENGTH) {
            errors.push('Nome completo deve ter pelo menos 3 caracteres');
        }
        
        // Validação do CPF
        if (!utils.validateCPF(formData.cpf)) {
            errors.push('CPF inválido');
        }
        
        // Validação do telefone
        if (!utils.validatePhone(formData.phone)) {
            errors.push('Telefone inválido (deve incluir DDD)');
        }
        
        // Validação da quantidade de pessoas
        const peopleCount = parseInt(formData.peopleCount);
        if (!peopleCount || peopleCount < VALIDATION_CONFIG.MIN_PEOPLE || peopleCount > VALIDATION_CONFIG.MAX_PEOPLE) {
            errors.push(`Quantidade de pessoas deve ser entre ${VALIDATION_CONFIG.MIN_PEOPLE} e ${VALIDATION_CONFIG.MAX_PEOPLE}`);
        }
        
        // Validação da data
        if (!utils.validateDate(formData.reservationDate)) {
            errors.push('Data da reserva deve ser hoje ou uma data futura');
        }
        
        return errors;
    }

    clearAllErrors() {
        document.querySelectorAll('.error').forEach(element => {
            utils.clearError(element);
        });
    }

    highlightErrors(errors) {
        errors.forEach(error => {
            // Mapeia mensagens de erro para campos específicos
            if (error.includes('Nome')) {
                const nameInput = document.getElementById('fullName');
                if (nameInput) utils.showError(nameInput, error);
            } else if (error.includes('CPF')) {
                const cpfInput = document.getElementById('cpf');
                if (cpfInput) utils.showError(cpfInput, error);
            } else if (error.includes('Telefone')) {
                const phoneInput = document.getElementById('phone');
                if (phoneInput) utils.showError(phoneInput, error);
            } else if (error.includes('pessoas')) {
                const peopleSelect = document.getElementById('peopleCount');
                if (peopleSelect) utils.showError(peopleSelect, error);
            } else if (error.includes('Data')) {
                const dateInput = document.getElementById('reservationDate');
                if (dateInput) utils.showError(dateInput, error);
            }
        });
    }
}

// Validação específica para reservas
class ReservationValidator {
    static async validateReservation(reservationData) {
        const errors = [];
        
        // Validações básicas
        const basicErrors = utils.validateReservationForm(reservationData);
        errors.push(...basicErrors);
        
        if (errors.length > 0) {
            return { valid: false, errors };
        }
        
        // Validações específicas do negócio
        try {
            // Verifica se o CPF já tem reserva ativa
            const cpfCheckResponse = await fetch(`${utils.API_BASE_URL}/api/reservas/verificar/${reservationData.cpf.replace(/\D/g, '')}`);
            const cpfCheckData = await cpfCheckResponse.json();
            
            if (cpfCheckData.success && cpfCheckData.data.temReserva) {
                errors.push('CPF já possui uma reserva ativa. Só será possível fazer nova reserva após a data da reserva atual.');
            }
            
            // Verifica disponibilidade da data
            const availabilityResponse = await fetch(`${utils.API_BASE_URL}/api/reservas/disponibilidade?data=${reservationData.data}`);
            const availabilityData = await availabilityResponse.json();
            
            if (availabilityData.success && !availabilityData.data.disponivel) {
                errors.push('Não há mesas disponíveis para a data selecionada.');
            }
            
        } catch (error) {
            console.error('Erro na validação da reserva:', error);
            errors.push('Erro ao validar reserva. Tente novamente.');
        }
        
        return { valid: errors.length === 0, errors };
    }
}

// Validação para login administrativo
class AdminValidator {
    static validateLogin(credentials) {
        const errors = [];
        
        if (!credentials.username || credentials.username.trim().length === 0) {
            errors.push('Usuário é obrigatório');
        }
        
        if (!credentials.password || credentials.password.trim().length === 0) {
            errors.push('Senha é obrigatória');
        }
        
        return { valid: errors.length === 0, errors };
    }
}

// Inicializar validação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.formValidator = new FormValidator();
});

// Exportar classes para uso global
window.ReservationValidator = ReservationValidator;
window.AdminValidator = AdminValidator;
window.VALIDATION_CONFIG = VALIDATION_CONFIG; 