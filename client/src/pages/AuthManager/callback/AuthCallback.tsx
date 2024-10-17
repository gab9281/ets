import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../../services/ApiService';
import { jwtDecode } from 'jwt-decode';

const OAuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const user = searchParams.get('user');

        if (user) {
            // Save user data to localStorage or sessionStorage
            console.log(user);
            apiService.saveToken(user);

            const decodedToken = jwtDecode(user); 
            const { email } = decodedToken as { email: string;};
            console.log(email + " connected!");
            
            // Navigate to the dashboard or another page
            navigate('/');
        } else {
            navigate('/login');
        }
    }, []);

    return <div>Loading...</div>;
};

export default OAuthCallback;
