import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [isAdmin, setIsAdmin] = useState(false);
    const host = import.meta.env.VITE_API;

    // Fetch user info from backend
    const fetchUserInfo = async (token) => {
        try {
            const response = await fetch(`${host}/api/auth/me`, {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setIsAdmin(data.isAdmin || false);
            } else {
                setIsAdmin(false);
            }
        } catch {
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
        if (token) {
            fetchUserInfo(token);
        } else {
            setIsAdmin(false);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        fetchUserInfo(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);