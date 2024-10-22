// constants.tsx
const ENV_VARIABLES = {
    MODE: 'production',
    VITE_BACKEND_URL: process.env.VITE_BACKEND_URL || "",
    BACKEND_URL: process.env.SITE_URL != undefined ? `${process.env.SITE_URL}${process.env.USE_PORTS ? `:${process.env.BACKEND_PORT}`:''}` : process.env.VITE_BACKEND_URL || '',
    FRONTEND_URL: process.env.SITE_URL != undefined ? `${process.env.SITE_URL}${process.env.USE_PORTS ? `:${process.env.PORT}`:''}` : ''
};

export { ENV_VARIABLES };
