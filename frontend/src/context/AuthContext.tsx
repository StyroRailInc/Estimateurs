import { createContext, ReactNode, useContext, useState, useEffect } from "react";

const AuthContext = createContext<{
  user: { name: string; email: string; token: string } | null;
  login: (userData: { name: string; email: string; token: string }) => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ name: string; email: string; token: string } | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  });

  const login = (userData: { name: string; email: string; token: string }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
