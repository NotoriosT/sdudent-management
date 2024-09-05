import axios from 'axios';

const API_URL = 'http://54.233.246.16:8080/api'; // URL base para a API

// Função auxiliar para configurar o cabeçalho com o token JWT
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Função para fazer login
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { username, password });
        // Armazena o token JWT no localStorage após o login bem-sucedido
        localStorage.setItem('token', response.data.token);
        return response.data.token;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
};

// Função para buscar todos os participantes
export const fetchParticipants = async () => {
    try {
        const response = await axios.get(`${API_URL}/participantes`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Erro ao carregar participantes:', error);
        throw error;
    }
};

// Função para adicionar um novo participante
export const addParticipant = async (participant) => {
    try {
        const response = await axios.post(`${API_URL}/participantes`, participant, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar participante:', error);
        throw error;
    }
};

// Função para editar um participante existente
export const updateParticipant = async (id, participant) => {
    try {
        const response = await axios.put(`${API_URL}/participantes/${id}`, participant, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Erro ao editar participante:', error);
        throw error;
    }
};

// Função para deletar um participante
export const deleteParticipant = async (id) => {
    try {
        await axios.delete(`${API_URL}/participantes/${id}`, getAuthHeader());
    } catch (error) {
        console.error('Erro ao deletar participante:', error);
        throw error;
    }
};
