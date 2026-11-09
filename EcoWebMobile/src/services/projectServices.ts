import api from "./api";

export async function getMeProjects(token: string) {
    return api.get('/projects/me', {
        headers: { Authorization: `Bearer ${token}` },
    });
}
