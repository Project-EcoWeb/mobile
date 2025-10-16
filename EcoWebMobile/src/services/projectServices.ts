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

export async function getProjectById(id: string, token: string) {
    try {
        const response = await api.get(`/projects/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (response.status === 200) {
            return response;
        }

        throw new Error(`ERRO: find material by ${id} `);
    } catch (error: any) {
        throw new Error(`Erro: ${error.message}`);
    }
}