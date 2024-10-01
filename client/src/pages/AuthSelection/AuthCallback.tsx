import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../services/ApiService';

const OAuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const user = searchParams.get('user');

        if (user) {
            // Save user data to localStorage or sessionStorage
            apiService.saveToken(user);

            // Navigate to the dashboard or another page
            navigate('/');
        } else {
            navigate('/auth-selection');
        }
    }, [location, navigate]);

    return <div>Loading...</div>;
};

export default OAuthCallback;
