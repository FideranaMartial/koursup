import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [form, setForm] = useState({ email: '', motDePasse: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const handleSubmit = async () => {
        try {
            const res = await api.post('/auth/login', form);
            localStorage.setItem('token', res.data.token);
            await refreshUser();
            toast.success('Connexion réussie !');
            navigate('/dashboard');
        } catch {
            toast.error('Email ou mot de passe incorrect');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.glowOrb}></div>
            <div style={styles.glowOrb2}></div>
            <div style={styles.card}>
                <div style={styles.logoIcon}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M16 2L4 9L16 16L28 9L16 2Z" stroke="#00d4ff" strokeWidth="1.5" fill="none"/>
                        <path d="M4 16L16 23L28 16" stroke="#00d4ff" strokeWidth="1.5" fill="none"/>
                        <path d="M4 23L16 30L28 23" stroke="#00d4ff" strokeWidth="1.5" fill="none"/>
                        <circle cx="16" cy="16" r="2" fill="#00d4ff"/>
                    </svg>
                </div>
                <h2 style={styles.title}>KoursUp</h2>
                <p style={styles.subtitle}>Connexion</p>
                <input style={styles.input} placeholder="Email" type="email"
                       value={form.email}
                       onChange={e => setForm({...form, email: e.target.value})} />
                <div style={styles.passwordContainer}>
                    <input 
                        style={styles.passwordInput} 
                        placeholder="Mot de passe"
                        type={showPassword ? "text" : "password"} 
                        value={form.motDePasse}
                        onChange={e => setForm({...form, motDePasse: e.target.value})}
                    />
                    <button 
                        type="button"
                        style={styles.eyeButton}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                </div>
                <button style={styles.button} onClick={handleSubmit}>
                    Se connecter
                </button>
                <p style={styles.link}>
                    Pas de compte ?{' '}
                    <span style={styles.linkText}
                          onClick={() => navigate('/register')}>
                        S'inscrire
                    </span>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: { 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center', 
        height: '100vh', 
        background: 'radial-gradient(ellipse at 20% 30%, #0a0a1a, #05050a)',
        position: 'relative',
        overflow: 'hidden'
    },
    glowOrb: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(0,212,255,0) 70%)',
        borderRadius: '50%',
        top: '-200px',
        right: '-100px',
        animation: 'pulse 4s ease-in-out infinite'
    },
    glowOrb2: {
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, rgba(0,212,255,0) 70%)',
        borderRadius: '50%',
        bottom: '-150px',
        left: '-100px',
        animation: 'pulse 5s ease-in-out infinite reverse'
    },
    card: { 
        background: 'rgba(15, 15, 25, 0.85)',
        backdropFilter: 'blur(20px)',
        padding: '2rem', 
        borderRadius: '24px',
        width: '380px', 
        border: '1px solid rgba(0, 212, 255, 0.3)',
        boxShadow: '0 0 40px rgba(0, 212, 255, 0.1)',
        position: 'relative',
        zIndex: 1
    },
    logoIcon: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '16px'
    },
    title: { 
        textAlign: 'center', 
        color: '#00d4ff', 
        marginBottom: '4px',
        fontSize: '28px',
        fontWeight: '700',
        letterSpacing: '-0.5px'
    },
    subtitle: { 
        textAlign: 'center', 
        color: '#6b6b8a', 
        marginBottom: '1.5rem',
        fontSize: '14px',
        fontWeight: '400'
    },
    input: { 
        width: '100%', 
        padding: '12px 16px', 
        marginBottom: '12px',
        border: '1px solid rgba(0, 212, 255, 0.2)', 
        borderRadius: '12px', 
        fontSize: '14px',
        boxSizing: 'border-box', 
        background: 'rgba(5, 5, 10, 0.8)', 
        color: '#e2e2e2',
        fontFamily: 'Space Grotesk, sans-serif',
        transition: 'all 0.2s ease'
    },
    passwordContainer: {
        position: 'relative',
        marginBottom: '12px',
        width: '100%'
    },
    passwordInput: {
        width: '100%',
        padding: '12px 45px 12px 16px',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        borderRadius: '12px',
        fontSize: '14px',
        boxSizing: 'border-box',
        background: 'rgba(5, 5, 10, 0.8)',
        color: '#e2e2e2',
        fontFamily: 'Space Grotesk, sans-serif',
        transition: 'all 0.2s ease'
    },
    eyeButton: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#6b6b8a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        transition: 'color 0.2s ease'
    },
    button: { 
        width: '100%', 
        padding: '12px', 
        background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
        color: 'white', 
        border: 'none', 
        borderRadius: '12px',
        fontSize: '15px', 
        cursor: 'pointer',
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)'
    },
    link: { 
        textAlign: 'center', 
        marginTop: '1rem', 
        color: '#6b6b8a',
        fontSize: '13px'
    },
    linkText: { 
        color: '#00d4ff', 
        cursor: 'pointer', 
        fontWeight: '600' 
    }
};