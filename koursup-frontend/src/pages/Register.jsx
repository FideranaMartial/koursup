import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
    const [form, setForm] = useState({
        nom: '', prenom: '', email: '',
        motDePasse: '', filiere: '', niveau: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const res = await api.post('/auth/register', form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            toast.success('Inscription réussie !');
            navigate('/dashboard');
        } catch (err) {
            toast.error("Erreur lors de l'inscription");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.glowOrb}></div>
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
                <p style={styles.subtitle}>Créer un compte</p>
                {['nom', 'prenom', 'email', 'motDePasse', 'filiere', 'niveau'].map(field => (
                    <input
                        key={field}
                        style={styles.input}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        type={field === 'motDePasse' ? 'password' :
                              field === 'email' ? 'email' : 'text'}
                        value={form[field]}
                        onChange={e => setForm({...form, [field]: e.target.value})}
                    />
                ))}
                <button style={styles.button} onClick={handleSubmit}>
                    S'inscrire
                </button>
                <p style={styles.link}>
                    Déjà un compte ?{' '}
                    <span style={styles.linkText}
                          onClick={() => navigate('/login')}>
                        Se connecter
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
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, rgba(0,212,255,0) 70%)',
        borderRadius: '50%',
        bottom: '-250px',
        right: '-150px'
    },
    card: { 
        background: 'rgba(15, 15, 25, 0.85)',
        backdropFilter: 'blur(20px)',
        padding: '2rem', 
        borderRadius: '24px',
        width: '400px', 
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
        fontSize: '14px'
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