import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Documents from './pages/Documents';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ color: '#a5b4fc',
                         textAlign: 'center', marginTop: '40vh' }}>
                            Chargement...
                        </div>;
    return user ? children : <Navigate to="/login" />;
};

export default function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/documents" element={
                    <PrivateRoute><Documents /></PrivateRoute>
                } />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}