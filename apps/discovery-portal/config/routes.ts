
export const ROUTES = {
    HOME: '/',
    COLLECTIONS: '/collections',
    GALLERY: '/gallery',
    VIEWER: '/viewer',
    DEPOSIT: '/deposit',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    DASHBOARD: '/dashboard',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
