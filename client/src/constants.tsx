// constants.tsx
const ENV_VARIABLES = {
    MODE: 'production',
    VITE_BACKEND_URL: process.env.VITE_BACKEND_URL || ""
};

console.log(`ENV_VARIABLES.VITE_BACKEND_URL=${ENV_VARIABLES.VITE_BACKEND_URL}`);

export { ENV_VARIABLES };
