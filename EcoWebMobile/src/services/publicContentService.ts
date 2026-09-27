import { isAxiosError } from "axios";
import api from "./api";

export interface PublicAuthor {
  _id: string;
  name: string;
}

export interface PublicInstitution {
  _id: string;
  name: string;
  logo?: string;
  location: string;
}

export interface PublicProject {
  _id: string;
  title: string;
  user: string | PublicAuthor;
  image: string;
  description: string;
  materials: string[];
  stages: string[];
  video?: string | null;
  category: string;
  difficulty: "Facil" | "Medio" | "Dificil";
  createdAt?: string;
}

export interface PublicMaterial {
  _id: string;
  name: string;
  image?: string;
  description: string;
  location: string;
  quantity: number;
  category: string;
  unitOfMeasure: string;
  instructions?: string;
  status: "publicado";
  company: string | PublicInstitution;
  createdAt?: string;
}

export interface HomeContent {
  projects: PublicProject[];
  materials: PublicMaterial[];
}

export interface SearchContent {
  query: string;
  results: HomeContent;
  meta: {
    numberProjects: number;
    numberMaterials: number;
    total: number;
  };
}

export interface PublicInstitutionProfile extends PublicInstitution {
  materials: PublicMaterial[];
}

export async function getHomeContent() {
  const response = await api.get<HomeContent>("/home");
  return response.data;
}

export async function listPublicProjects() {
  const response = await api.get<PublicProject[]>("/projects");
  return response.data;
}

export async function getPublicProject(id: string) {
  const response = await api.get<PublicProject>(`/projects/${id}`);
  return response.data;
}

export async function listPublicMaterials() {
  const response = await api.get<PublicMaterial[]>("/materials");
  return response.data;
}

export async function getPublicMaterial(id: string) {
  const response = await api.get<PublicMaterial>(`/materials/${id}`);
  return response.data;
}

export async function searchPublicContent(query: string) {
  const response = await api.get<SearchContent>("/search", {
    params: { query: query.trim().slice(0, 100) },
  });
  return response.data;
}

export async function getPublicInstitutionProfile(id: string) {
  const response = await api.get<PublicInstitutionProfile>(`/institutions/${id}/profile`);
  return response.data;
}

export function getPublicContentError(error: unknown, fallback: string) {
  if (!isAxiosError(error)) {
    return fallback;
  }

  if (error.response?.status === 404) {
    return "Conteúdo não encontrado ou não está mais disponível.";
  }

  if (!error.response) {
    return "Não foi possível conectar à EcoWeb. Verifique sua conexão e tente novamente.";
  }

  return error.response.data?.message ?? error.response.data?.error ?? fallback;
}

export function getAuthorName(project: PublicProject) {
  return typeof project.user === "object" ? project.user.name : "Usuário da EcoWeb";
}

export function getInstitution(material: PublicMaterial): PublicInstitution | null {
  return typeof material.company === "object" ? material.company : null;
}
