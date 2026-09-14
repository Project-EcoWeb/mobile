import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "@ecoweb_token";
const AUTH_USER_KEY = "@ecoweb_user";

export interface User {
  id: string;
  name: string;
  email: string;
  userType: "creator" | "company";
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [token, serializedUser] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(AUTH_USER_KEY),
        ]);

        if (!token || !serializedUser) {
          if (token || serializedUser) {
            await Promise.all([
              AsyncStorage.removeItem(AUTH_TOKEN_KEY),
              AsyncStorage.removeItem(AUTH_USER_KEY),
            ]);
          }
          return;
        }

        const storedUser = JSON.parse(serializedUser) as Omit<User, "token">;
        if (!storedUser.id || !storedUser.name || !storedUser.email) {
          throw new Error("Dados de sessão inválidos.");
        }

        setUser({ ...storedUser, token });
      } catch {
        await Promise.all([
          AsyncStorage.removeItem(AUTH_TOKEN_KEY),
          AsyncStorage.removeItem(AUTH_USER_KEY),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const signIn = async (authenticatedUser: User) => {
    const { token, ...userToPersist } = authenticatedUser;
    await Promise.all([
      AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
      AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userToPersist)),
    ]);
    setUser(authenticatedUser);
  };

  const signOut = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(AUTH_USER_KEY),
      ]);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
