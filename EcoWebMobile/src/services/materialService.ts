import api from "./api";

export async function getMaterialById(id: string) {
    try {
        const response = await api.get(`/materials/${id}`);
        if (response.status === 200) {
            return response;
        }
        throw new Error('Erro ao buscar Material');
    } catch (error: any) {
        throw new Error(`Erro de conexão com o servidor: ${error.message}`);
    }
}
