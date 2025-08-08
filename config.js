/**
 * Arquivo de configuração de exemplo
 * Copie este arquivo para config.js e personalize conforme necessário
 */

const CONFIG = {
    // Configurações da API
    API: {
        BASE_URL: 'http://localhost:3000',
        TIMEOUT: 10000, // 10 segundos
        RETRY_ATTEMPTS: 3
    },

    // Configurações do sistema
    SYSTEM: {
        MAX_RESERVATIONS_PER_DAY: 5,
        MIN_PEOPLE_PER_RESERVATION: 1,
        MAX_PEOPLE_PER_RESERVATION: 4,
        MIN_NAME_LENGTH: 3,
        MAX_NAME_LENGTH: 100
    },

    // Configurações de validação
    VALIDATION: {
        CPF_PATTERN: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        PHONE_PATTERN: /^\(\d{2}\) \d{5}-\d{4}$/,
        NAME_PATTERN: /^[a-zA-ZÀ-ÿ\s]+$/
    },

    // Configurações de UI
    UI: {
        THEME: {
            PRIMARY_COLOR: '#667eea',
            SECONDARY_COLOR: '#764ba2',
            SUCCESS_COLOR: '#48bb78',
            ERROR_COLOR: '#e53e3e',
            WARNING_COLOR: '#ed8936',
            INFO_COLOR: '#4299e1'
        },
        ANIMATIONS: {
            DURATION: 300,
            EASING: 'ease'
        },
        BREAKPOINTS: {
            MOBILE: 480,
            TABLET: 768,
            DESKTOP: 1024
        }
    },

    // Configurações de localização
    LOCALE: {
        LANGUAGE: 'pt-BR',
        DATE_FORMAT: 'DD/MM/YYYY',
        TIME_FORMAT: 'HH:mm',
        CURRENCY: 'BRL'
    },

    // Configurações de segurança
    SECURITY: {
        SESSION_TIMEOUT: 3600000, // 1 hora em ms
        MAX_LOGIN_ATTEMPTS: 5,
        PASSWORD_MIN_LENGTH: 6
    },

    // Configurações de notificações
    NOTIFICATIONS: {
        AUTO_HIDE_DELAY: 5000, // 5 segundos
        POSITION: 'top-right',
        MAX_VISIBLE: 3
    },

    // Configurações de cache
    CACHE: {
        ENABLED: true,
        DURATION: 300000, // 5 minutos
        MAX_SIZE: 50 // MB
    },

    // Configurações de debug
    DEBUG: {
        ENABLED: false,
        LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        SHOW_CONSOLE_LOGS: false
    }
};

// Exportar configuração
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
} 