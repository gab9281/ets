import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../../services/ApiService';

const OAuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const user = searchParams.get('user');

        if (user) {
            apiService.saveToken(user);
            navigate('/');
        } else {
            navigate('/login');
        }
    }, []);

    return <div>Loading...</div>;
};

export default OAuthCallback;
