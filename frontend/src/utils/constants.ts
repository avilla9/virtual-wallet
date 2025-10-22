export const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/v1';

export const VIEWS = {
    BALANCE: 'balance',
    LOAD: 'load',
    PAY: 'pay',
    REGISTER: 'register'
} as const;

export const STATUS_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info'
} as const;