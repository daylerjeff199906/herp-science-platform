/**
 * @file Configuration and validation of environment variables
 * @description Uses Zod to validate and type-check environment variables at runtime.
 * Prevents the app from starting if required variables are missing or invalid.
 */

import { z } from 'zod';

// Schema definition for environment variables
const envSchema = z.object({
    // API URLs for different environments
    NEXT_APP_API_URL_DEV: z.string().url().default('http://localhost:8000'),
    NEXT_APP_API_URL_PROD: z.string().url().optional(),

    // Node environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Session secret for authentication (minimum 32 characters)
    SESSION_SECRET: z.string().min(32).optional(),

    // App Name for cookies
    APP_NAME: z.string().default('vertebrados_admin'),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse({
    NEXT_APP_API_URL_DEV: process.env.NEXT_APP_API_URL_DEV,
    NEXT_APP_API_URL_PROD: process.env.NEXT_APP_API_URL_PROD,
    NODE_ENV: process.env.NODE_ENV,
    SESSION_SECRET: process.env.SESSION_SECRET,
    APP_NAME: process.env.APP_NAME,
});

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables. Please check your .env.local file.');
}

// Compute the base API URL based on environment
const API_BASE_URL = parsedEnv.data.NODE_ENV === 'production'
    ? parsedEnv.data.NEXT_APP_API_URL_PROD || parsedEnv.data.NEXT_APP_API_URL_DEV
    : parsedEnv.data.NEXT_APP_API_URL_DEV;

// Export validated environment variables
export const ENV = {
    ...parsedEnv.data,
    API_BASE_URL,
} as const;
