
import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginRequest, registerRequest } from '../api/authService';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode'; 

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                if (decodedUser.exp * 1000 > Date.now()) {
                    setUser(decodedUser);
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const signup = async (userData) => {
        try {
            setLoading(true);
            const res = await registerRequest(userData);
            localStorage.setItem('token', res.token);
            const decodedUser = jwtDecode(res.token);
            setUser(decodedUser);
            setIsAuthenticated(true);
        } catch (error) {
            toast.error(error.message || 'Error en el registro.');
            throw error; 
        } finally {
            setLoading(false);
        }
    };

    const signin = async (userData) => {
        try {
            setLoading(true);
            const res = await loginRequest(userData);
            localStorage.setItem('token', res.token);
            const decodedUser = jwtDecode(res.token);
            setUser(decodedUser);
            setIsAuthenticated(true);
        } catch (error) {
            toast.error(error.message || 'Credenciales incorrectas.');
            throw error;
        } finally {
            setLoading(false);
        }
    };
    
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ signup, signin, logout, user, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};