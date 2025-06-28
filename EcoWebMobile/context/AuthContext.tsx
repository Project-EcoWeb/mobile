import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    userType: 'creator' | 'company';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean; // NOVO: Estado de carregamento
    signIn: (userType: 'creator' | 'company', name?: string) => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // NOVO: Inicia como true

    useEffect(() => {
        // Em um app real, aqui você verificaria o AsyncStorage por um token.
        // Para simulação, apenas finalizamos o carregamento após 1 segundo.
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const signIn = (userType: 'creator' | 'company', name: string = 'Usuário') => {
        const mockUser: User = {
            id: userType === 'creator' ? 'user123' : 'company456',
            name: userType === 'creator' ? `${name} (Criador)` : `${name} (Empresa)`,
            userType: userType,
        };
        setUser(mockUser);
    };

    const signOut = () => {
        setUser(null);
    };

    // Adiciona isLoading ao valor do provider
    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};