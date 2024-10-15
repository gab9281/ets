import { ENV_VARIABLES } from '../constants';

class AuthService {

    private BASE_URL: string;

    constructor() {
        this.BASE_URL = ENV_VARIABLES.VITE_BACKEND_URL;
    }

    async fetchAuthData(){
        try {
            const response = await fetch(`${this.BASE_URL}/api/auth/getActiveAuth`);
            const data = await response.json();
            return data.authActive;
        } catch (error) {
            console.error('Erreur lors de la récupération des données d\'auth:', error);
        }
    };

}

const authService = new AuthService();
export default authService;