import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Charge les infos fraîches depuis le backend
    const refreshUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            const res = await api.get('/users/me');
            setUser(res.data);
        } catch {
            setUser(null);
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    useEffect(() => { refreshUser(); }, []);

    return (
        <AuthContext.Provider value={{ user, refreshUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);