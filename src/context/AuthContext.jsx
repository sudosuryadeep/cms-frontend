import { createContext, useContext, useEffect, useState } from "react";
import { getMe, login as loginApi } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe()
        .then((res) => {
          // backend kuch bhi return kare — handle karo
          const userData = res.data?.data || res.data?.user || res.data;
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginApi(email, password);

    // sabhi possible structures handle karo
    const payload = res.data?.data || res.data;
    const token = payload?.token || payload?.accessToken;
    const userData = payload?.user || payload;

    if (!token) throw new Error("Token nahi mila response mein");

    localStorage.setItem("token", token);
    setUser(userData);
    return payload;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);