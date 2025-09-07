import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const navigate = useNavigate();

    const login = (newUserId) => {
        localStorage.setItem('userId', newUserId);
        setUserId(newUserId);
        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('userId');
        setUserId(null);
        navigate('/');
    };

    const value = {
        userId,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};