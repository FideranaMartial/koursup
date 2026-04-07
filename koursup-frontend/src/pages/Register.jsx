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
            navigate('/documents');
        } catch (err) {
            toast.error("Erreur lors de l'inscription");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
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
    container: { display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh',
        background: '#0f0f13' },
card: { background: '#16161f', padding: '2rem', borderRadius: '12px',
   width: '360px', border: '1px solid #2a2a3a' },
title: { textAlign: 'center', color: '#a5b4fc', marginBottom: '4px' },
subtitle: { textAlign: 'center', color: '#555', marginBottom: '1.5rem' },
input: { width: '100%', padding: '10px', marginBottom: '12px',
    border: '1px solid #2a2a3a', borderRadius: '8px',
    fontSize: '14px', boxSizing: 'border-box',
    background: '#0f0f13', color: '#e2e2e2' },
button: { width: '100%', padding: '12px', background: '#534AB7',
     color: 'white', border: 'none', borderRadius: '8px',
     fontSize: '15px', cursor: 'pointer', marginTop: '4px' },
link: { textAlign: 'center', marginTop: '1rem', color: '#555' },
linkText: { color: '#a5b4fc', cursor: 'pointer', fontWeight: '500' }
};