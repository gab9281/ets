import { useNavigate } from 'react-router-dom';

// JoinRoom.tsx
import React, { useEffect, useState } from 'react';

import { TextField, FormLabel, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import LoginContainer from '../../../../components/LoginContainer/LoginContainer';
import ApiService from '../../../../services/ApiService';

const Register: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('etudiant');

    const [connectionError, setConnectionError] = useState<string>('');
    const [isConnecting] = useState<boolean>(false);

    useEffect(() => {
        return () => { };
    }, []);

    const register = async () => {
        const result = await ApiService.register(email, password, role);

        if (result !== true) {
            setConnectionError(result);
            return;
        }

        navigate("/login");
    };

    return (
        <LoginContainer
            title="Créer un compte"
            error={connectionError}
        >
            <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse courriel"
                sx={{ marginBottom: '1rem' }}
                fullWidth
            />

            <TextField
                label="Mot de passe"
                variant="outlined"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                sx={{ marginBottom: '1rem' }}
                fullWidth
            />

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <FormLabel component="legend" sx={{ marginRight: '1rem' }}>Choisir votre rôle</FormLabel>
                <RadioGroup
                    row
                    aria-label="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <FormControlLabel value="etudiant" control={<Radio />} label="Étudiant" />
                    <FormControlLabel value="professeur" control={<Radio />} label="Professeur" />
                </RadioGroup>
            </Box>

            <LoadingButton
                loading={isConnecting}
                onClick={register}
                variant="contained"
                sx={{ marginBottom: `${connectionError && '2rem'}` }}
                disabled={!email || !password}
            >
                S'inscrire
            </LoadingButton>
        </LoginContainer>
    );
};

export default Register;
