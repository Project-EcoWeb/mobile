import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  userType: "creator" | "company";
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (
    userType: "creator" | "company",
    name: string,
    email: string,
    id: string,
    token: string
  ) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const signIn = (
    userType: "creator" | "company",
    name: string,
    email: string,
    id: string,
    token: string
  ) => {
    const authenticatedUser: User = {
      id,
      name,
      email,
      userType,
      token,
    };

    setUser(authenticatedUser);

  };

  const signOut = () => {
    setUser(null);
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
