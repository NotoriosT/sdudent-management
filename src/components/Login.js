import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Avatar, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled, keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { login } from './api';  // Importa a função de login do `api.js`

// Animação do gradiente de fundo
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Estilização do fundo com gradiente animado
const Background = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: 'linear-gradient(135deg, #FF6F61, #FE6B8B, #FF8E53, #FFC371)',
    backgroundSize: '300% 300%',
    animation: `${gradientAnimation} 15s ease infinite`,
});

const FormContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
});

const AnimatedAvatar = styled(Avatar)({
    margin: '1rem',
    bgcolor: 'secondary.main',
});

const LoginButton = styled(Button)({
    marginTop: '1rem',
    backgroundColor: '#FF8E53',
    color: '#fff',
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '50px',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: '#FE6B8B',
        transform: 'scale(1.05)',
    },
    '&:active': {
        backgroundColor: '#FF6F61',
        transform: 'scale(0.95)',
    },
});

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const token = await login(username, password); // Faz o login e armazena o token
            if (token) {
                navigate('/participants'); // Redireciona para a lista de participantes após o login bem-sucedido
            }
        } catch (error) {
            setError('Usuário ou senha inválidos');
        }
    };

    return (
        <Background>
            <FormContainer maxWidth="xs">
                <AnimatedAvatar>
                    <LockOutlinedIcon />
                </AnimatedAvatar>
                <Typography component="h1" variant="h5">
                    Acesso ao Sistema de Gestão de Alunos
                </Typography>
                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Usuário"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Senha"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <LoginButton
                        type="submit"
                        fullWidth
                        variant="contained"
                    >
                        Entrar
                    </LoginButton>
                </Box>
            </FormContainer>
        </Background>
    );
};

export default Login;
