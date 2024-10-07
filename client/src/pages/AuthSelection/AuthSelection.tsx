import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './authselection.css';
import SimpleLogin from './SimpleLogin';

const AuthSelection: React.FC = () => {
    const [authData, setAuthData] = useState<any>(null); // Stocke les données d'auth
    const navigate = useNavigate();

    // Récupérer les données d'authentification depuis l'API
    useEffect(() => {
        const fetchAuthData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/getActiveAuth');
                const data = await response.json();
                console.log('Auth Data:', data); // Affichage dans la console
                setAuthData(data.authActive); // Stocke les données dans l'état
            } catch (error) {
                console.error('Erreur lors de la récupération des données d\'auth:', error);
            }
        };
        fetchAuthData(); // Appel de la fonction pour récupérer les données
    }, []);

    const handleAuthLogin = (provider: string) => {
        window.location.href = 'http://localhost:3000/api/auth/' + provider;
    };

    return (
        <div className="auth-selection-page">
            <h1>Connexion</h1>
            
            {/* Formulaire de connexion Simple Login */}
            {authData && authData['simple-login'] && (
                <div className="form-container">
                    <SimpleLogin/>
                </div>
            )}
            
            {/* Conteneur OAuth */}
            {authData && Object.keys(authData).some(key => authData[key].type === 'oauth') && (
                <div className="oauth-container">
                    <h2>Se connecter avec OAuth</h2>
                    {Object.keys(authData).map((providerKey) => {
                        const provider = authData[providerKey];
                        if (provider.type === 'oauth') {
                            return (
                                <button key={providerKey} className="provider-btn oauth-btn" onClick={() => handleAuthLogin(providerKey)}>
                                    Continuer avec {providerKey}
                                </button>
                            );
                        }
                        return null;
                    })}
                </div>
            )}

            {/* Conteneur OIDC */}
            {authData && Object.keys(authData).some(key => authData[key].type === 'oidc') && (
                <div className="oidc-container">
                    <h2>Se connecter avec OIDC</h2>
                    {Object.keys(authData).map((providerKey) => {
                        const provider = authData[providerKey];
                        if (provider.type === 'oidc') {
                            return (
                                <button key={providerKey} className="provider-btn oidc-btn" onClick={() => handleAuthLogin(providerKey)}>
                                    Continuer avec {providerKey}
                                </button>
                            );
                        }
                        return null;
                    })}
                </div>
            )}

            <div>
                <button className="home-button-container" onClick={() => navigate('/')}>Retour à l'accueil</button>
            </div>
        </div>
    );
};

export default AuthSelection;
