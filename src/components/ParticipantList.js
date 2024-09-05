import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    Typography,
    IconButton,
    TablePagination,
    useMediaQuery,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { fetchParticipants, addParticipant, updateParticipant, deleteParticipant } from './api'; // Importando do arquivo api.js

const ParticipantList = () => {
    const [participants, setParticipants] = useState([]);
    const [newParticipant, setNewParticipant] = useState({
        nome: '',
        idade: '',
        notaPrimeiroSemestre: '',
        notaSegundoSemestre: '',
    });
    const [editParticipant, setEditParticipant] = useState(null);
    const [searchId, setSearchId] = useState('');
    const [filteredParticipants, setFilteredParticipants] = useState(participants);
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;

    const [errors, setErrors] = useState({}); // Estado para armazenar erros de validação

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Verifica se a tela é pequena

    // Carregar participantes do backend na montagem do componente
    useEffect(() => {
        loadParticipants();
    }, []);

    const loadParticipants = async () => {
        try {
            const data = await fetchParticipants(); // Usando a função centralizada
            setParticipants(data);
            setFilteredParticipants(data);
        } catch (error) {
            console.error('Erro ao carregar participantes:', error);
        }
    };

    const handleInputChange = (e) => {
        setNewParticipant({ ...newParticipant, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' }); // Limpa o erro do campo ao digitar
    };

    const handleEditInputChange = (e) => {
        setEditParticipant({ ...editParticipant, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' }); // Limpa o erro do campo ao digitar
    };

    const handleAddParticipant = async () => {
        try {
            const data = await addParticipant(newParticipant); // Usando a função centralizada
            setParticipants([...participants, data]);
            setFilteredParticipants([...participants, data]);
            setNewParticipant({
                nome: '',
                idade: '',
                notaPrimeiroSemestre: '',
                notaSegundoSemestre: '',
            });
            setErrors({}); // Limpa os erros após o sucesso
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrors(error.response.data); // Armazena os erros retornados pela API
            } else {
                console.error('Erro ao adicionar participante:', error);
            }
        }
    };

    const handleDeleteParticipant = async (id) => {
        try {
            await deleteParticipant(id); // Usando a função centralizada
            const updatedParticipants = participants.filter((participant) => participant.id !== id);
            setParticipants(updatedParticipants);
            setFilteredParticipants(updatedParticipants);
        } catch (error) {
            console.error('Erro ao deletar participante:', error);
        }
    };

    const handleEditParticipant = (participant) => {
        setEditParticipant(participant);
    };

    const handleSaveEdit = async () => {
        try {
            const updatedData = await updateParticipant(editParticipant.id, editParticipant); // Usando a função centralizada
            const updatedParticipants = participants.map((participant) =>
                participant.id === updatedData.id ? updatedData : participant
            );
            setParticipants(updatedParticipants);
            setFilteredParticipants(updatedParticipants);
            setEditParticipant(null);
            setErrors({}); // Limpa os erros após o sucesso
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrors(error.response.data); // Armazena os erros retornados pela API
            } else {
                console.error('Erro ao editar participante:', error);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditParticipant(null);
        setErrors({}); // Limpa os erros ao cancelar
    };

    const handleSearchChange = (e) => {
        setSearchId(e.target.value);
        if (e.target.value) {
            const searchResult = participants.filter((participant) =>
                participant.id.toString().includes(e.target.value)
            );
            setFilteredParticipants(searchResult);
        } else {
            setFilteredParticipants(participants);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <Box sx={{ padding: 4, maxWidth: '1000px', margin: '0 auto', backgroundColor: '#f5f5f5', borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#3f51b5', fontWeight: 'bold', marginBottom: 3 }}>
                Lista de Participantes
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    marginBottom: 4,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    padding: 3,
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <TextField
                    label="Nome"
                    name="nome"
                    value={newParticipant.nome}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.nome}
                    helperText={errors.nome}
                    sx={{ flex: '1 1 300px' }}
                />
                <TextField
                    label="Idade"
                    name="idade"
                    value={newParticipant.idade}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.idade}
                    helperText={errors.idade}
                    sx={{ flex: '1 1 100px' }}
                />
                <TextField
                    label="Nota 1º Semestre"
                    name="notaPrimeiroSemestre"
                    value={newParticipant.notaPrimeiroSemestre}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.notaPrimeiroSemestre}
                    helperText={errors.notaPrimeiroSemestre}
                    sx={{ flex: '1 1 150px' }}
                />
                <TextField
                    label="Nota 2º Semestre"
                    name="notaSegundoSemestre"
                    value={newParticipant.notaSegundoSemestre}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.notaSegundoSemestre}
                    helperText={errors.notaSegundoSemestre}
                    sx={{ flex: '1 1 150px' }}
                />
                <Button
                    variant="contained"
                    onClick={handleAddParticipant}
                    sx={{
                        marginTop: 2,
                        backgroundColor: '#4caf50',
                        color: '#fff',
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        '&:hover': { backgroundColor: '#45a049' },
                        borderRadius: '8px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                    }}
                    fullWidth
                >
                    Adicionar
                </Button>
            </Box>
            <Box sx={{ marginBottom: 4 }}>
                <TextField
                    label="Buscar por ID"
                    value={searchId}
                    onChange={handleSearchChange}
                    fullWidth
                    sx={{ backgroundColor: '#ffffff', borderRadius: '8px' }}
                />
            </Box>
            <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#3f51b5' }}>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nome</TableCell>
                            {isSmallScreen ? (
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Média Final</TableCell>
                            ) : (
                                <>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Idade</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nota 1º Semestre</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nota 2º Semestre</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Média Final</TableCell>
                                </>
                            )}
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredParticipants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((participant) => (
                            <TableRow key={participant.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f1f1f1' } }}>
                                <TableCell>{participant.nome}</TableCell>
                                {isSmallScreen ? (
                                    <TableCell>{participant.mediaFinal}</TableCell>
                                ) : (
                                    <>
                                        <TableCell>{participant.idade}</TableCell>
                                        <TableCell>{participant.notaPrimeiroSemestre}</TableCell>
                                        <TableCell>{participant.notaSegundoSemestre}</TableCell>
                                        <TableCell>{participant.mediaFinal}</TableCell>
                                    </>
                                )}
                                <TableCell>
                                    <IconButton
                                        aria-label="edit"
                                        sx={{ color: '#1976d2', '&:hover': { color: '#0d47a1' } }}
                                        onClick={() => handleEditParticipant(participant)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="delete"
                                        sx={{ color: '#e53935', '&:hover': { color: '#b71c1c' } }}
                                        onClick={() => handleDeleteParticipant(participant.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                <TablePagination
                    component="div"
                    count={filteredParticipants.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage=""
                    rowsPerPageOptions={[]}
                    sx={{
                        backgroundColor: '#f0f4f7',
                        borderRadius: '10px',
                        padding: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        '& .MuiTablePagination-toolbar': {
                            justifyContent: 'center',
                        },
                        '& .MuiTablePagination-actions': {
                            margin: 0,
                        },
                    }}
                />
            </Box>

            <Dialog open={editParticipant !== null} onClose={handleCancelEdit}>
                <DialogTitle sx={{ backgroundColor: '#3f51b5', color: '#fff', textAlign: 'center' }}>Editar Participante</DialogTitle>
                <DialogContent sx={{ padding: '20px', backgroundColor: '#f0f4f7' }}>
                    <TextField
                        label="Nome"
                        name="nome"
                        value={editParticipant?.nome || ''}
                        onChange={handleEditInputChange}
                        fullWidth
                        error={!!errors.nome}
                        helperText={errors.nome}
                        sx={{ marginBottom: 2, backgroundColor: '#ffffff', borderRadius: '8px', marginTop: "20px" }}
                    />
                    <TextField
                        label="Idade"
                        name="idade"
                        value={editParticipant?.idade || ''}
                        onChange={handleEditInputChange}
                        fullWidth
                        error={!!errors.idade}
                        helperText={errors.idade}
                        sx={{ marginBottom: 2, backgroundColor: '#ffffff', borderRadius: '8px' }}
                    />
                    <TextField
                        label="Nota 1º Semestre"
                        name="notaPrimeiroSemestre"
                        value={editParticipant?.notaPrimeiroSemestre || ''}
                        onChange={handleEditInputChange}
                        fullWidth
                        error={!!errors.notaPrimeiroSemestre}
                        helperText={errors.notaPrimeiroSemestre}
                        sx={{ marginBottom: 2, backgroundColor: '#ffffff', borderRadius: '8px' }}
                    />
                    <TextField
                        label="Nota 2º Semestre"
                        name="notaSegundoSemestre"
                        value={editParticipant?.notaSegundoSemestre || ''}
                        onChange={handleEditInputChange}
                        fullWidth
                        error={!!errors.notaSegundoSemestre}
                        helperText={errors.notaSegundoSemestre}
                        sx={{ marginBottom: 2, backgroundColor: '#ffffff', borderRadius: '8px' }}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', paddingBottom: '20px', backgroundColor: '#f0f4f7' }}>
                    <Button onClick={handleCancelEdit} sx={{ backgroundColor: '#e53935', color: '#fff', '&:hover': { backgroundColor: '#b71c1c' }, borderRadius: '8px', padding: '10px 20px' }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveEdit} sx={{ backgroundColor: '#4caf50', color: '#fff', '&:hover': { backgroundColor: '#45a049' }, borderRadius: '8px', padding: '10px 20px' }}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ParticipantList;
