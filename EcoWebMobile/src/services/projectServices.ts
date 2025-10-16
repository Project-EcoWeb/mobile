import api from "./api";

export async function getMeProjects(token: string) {
    try {
        const response = await api.get('/projects/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return response;
        }
        throw new Error('Erro ao buscar Projetos');
    } catch (error) {
        throw new Error('Erro de conexão com Servidor');
    }
}