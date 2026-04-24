// Classement.jsx - Version corrigée
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';  // ← Ajout de useLocation
import { useAuth } from '../context/AuthContext';

const MEDALS = ['🥇', '🥈', '🥉'];

const KARMA_COLORS = [
    { bg: '#0a1a1a', text: '#00d4ff', border: '#00d4ff44' },
    { bg: '#0a0a1a', text: '#00b8e6', border: '#00b8e644' },
    { bg: '#0a1520', text: '#00a0cc', border: '#00a0cc44' },
];

export default function Classement() {
    const [classement, setClassement] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();  // ← Ajout pour détecter la route active
    const { user, logout } = useAuth();

    // Fonction pour vérifier si un lien est actif
    const isActive = (path) => {
        return location.pathname === path;
    };

    useEffect(() => {
        api.get('/users/classement')
           .then(res => setClassement(res.data))
           .catch(() => {});
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const monRang = classement.findIndex(u => u.email === user?.email) + 1;

    return (
        <div style={s.page}>
            {/* Navbar */}
            <div style={s.nav}>
                <div style={s.logoBox}>
                    <div style={s.logoGlow}></div>
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                        <path d="M16 2L4 9L16 16L28 9L16 2Z" stroke="#00d4ff" strokeWidth="1.5" fill="none"/>
                        <path d="M4 16L16 23L28 16" stroke="#00d4ff" strokeWidth="1.5" fill="none"/>
                        <circle cx="16" cy="16" r="2" fill="#00d4ff"/>
                    </svg>
                    <span style={s.logo}>KoursUp</span>
                </div>
                <div style={s.navLinks}>
                    {/* Ordre: Dashboard (1er) → Documents (2e) → Classement (3e) */}
                    <span 
                        style={{...s.navLink, ...(isActive('/dashboard') ? s.navLinkActive : {})}}
                        onClick={() => navigate('/dashboard')}
                    >
                        Dashboard
                    </span>
                    <span 
                        style={{...s.navLink, ...(isActive('/documents') ? s.navLinkActive : {})}}
                        onClick={() => navigate('/documents')}
                    >
                        Documents
                    </span>
                    <span 
                        style={{...s.navLink, ...(isActive('/classement') ? s.navLinkActive : {})}}
                        onClick={() => navigate('/classement')}
                    >
                        Classement
                    </span>
                </div>
                <div style={s.navRight}>
                    <div style={s.karmaBox}>
                        <span style={s.karmaIcon}>⚡</span>
                        <span style={s.karmaText}>{user?.karma || 0} pts</span>
                    </div>
                    <button style={s.btnLogout} onClick={handleLogout}>
                        Déconnexion
                    </button>
                </div>
            </div>

            <div style={s.content}>
                <div style={s.header}>
                    <h1 style={s.title}>Classement des contributeurs</h1>
                    <p style={s.subtitle}>
                        Top 10 des étudiants les plus actifs ce mois-ci
                    </p>
                </div>

                {/* Ma position */}
                {monRang > 0 && (
                    <div style={s.maPositionBox}>
                        <span style={s.maPositionText}>
                            Ta position actuelle :
                        </span>
                        <span style={s.maPositionRang}>
                            #{monRang}
                        </span>
                        <span style={s.maPositionKarma}>
                            {user?.karma} pts
                        </span>
                    </div>
                )}

                {/* Podium top 3 */}
                {classement.length >= 3 && (
                    <div style={s.podium}>
                        <div style={{...s.podiumCard, ...s.podium2}}>
                            <div style={s.podiumMedal}>🥈</div>
                            <div style={s.podiumAvatar}>
                                {classement[1].prenom[0]}{classement[1].nom[0]}
                            </div>
                            <div style={s.podiumName}>
                                {classement[1].prenom} {classement[1].nom}
                            </div>
                            <div style={s.podiumKarma}>
                                ⚡ {classement[1].karma} pts
                            </div>
                            <div style={s.podiumFiliere}>
                                {classement[1].filiere}
                            </div>
                        </div>

                        <div style={{...s.podiumCard, ...s.podium1}}>
                            <div style={s.podiumMedal}>🥇</div>
                            <div style={{...s.podiumAvatar,
                                        background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
                                        width: '60px', height: '60px',
                                        fontSize: '20px', boxShadow: '0 0 15px rgba(0,212,255,0.5)'}}>
                                {classement[0].prenom[0]}{classement[0].nom[0]}
                            </div>
                            <div style={{...s.podiumName, fontSize: '16px',
                                        color: '#00d4ff'}}>
                                {classement[0].prenom} {classement[0].nom}
                            </div>
                            <div style={{...s.podiumKarma, color: '#00d4ff'}}>
                                ⚡ {classement[0].karma} pts
                            </div>
                            <div style={s.podiumFiliere}>
                                {classement[0].filiere}
                            </div>
                        </div>

                        <div style={{...s.podiumCard, ...s.podium3}}>
                            <div style={s.podiumMedal}>🥉</div>
                            <div style={s.podiumAvatar}>
                                {classement[2].prenom[0]}{classement[2].nom[0]}
                            </div>
                            <div style={s.podiumName}>
                                {classement[2].prenom} {classement[2].nom}
                            </div>
                            <div style={s.podiumKarma}>
                                ⚡ {classement[2].karma} pts
                            </div>
                            <div style={s.podiumFiliere}>
                                {classement[2].filiere}
                            </div>
                        </div>
                    </div>
                )}

                {/* Liste complète */}
                <div style={s.liste}>
                    {classement.map((u, index) => {
                        const estMoi = u.email === user?.email;
                        const colors = KARMA_COLORS[index % 3];
                        return (
                            <div key={u.id} style={{
                                ...s.listeItem,
                                background: estMoi ? 'linear-gradient(135deg, #0a0a2a, #0a0a1a)' : '#0f0f17',
                                border: estMoi ? '1px solid #00d4ff' : s.listeItem.border
                            }}>
                                <div style={s.rang}>
                                    {index < 3
                                        ? MEDALS[index]
                                        : <span style={s.rangNum}>#{index + 1}</span>
                                    }
                                </div>
                                <div style={{
                                    ...s.avatar,
                                    background: estMoi ? 'linear-gradient(135deg, #00d4ff, #0099cc)' : '#1a1a2a'
                                }}>
                                    {u.prenom[0]}{u.nom[0]}
                                </div>
                                <div style={s.info}>
                                    <div style={s.infoNom}>
                                        {u.prenom} {u.nom}
                                        {estMoi && (
                                            <span style={s.moiTag}>Moi</span>
                                        )}
                                    </div>
                                    <div style={s.infoSub}>
                                        {u.filiere} · {u.niveau}
                                    </div>
                                </div>
                                <div style={{
                                    ...s.karmaTag,
                                    background: colors.bg,
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`
                                }}>
                                    {u.karma} pts
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: '100vh', background: '#0a0a0f', color: '#e2e2e2', fontFamily: 'Space Grotesk, sans-serif' },
    nav: { display: 'flex', justifyContent: 'space-between',
           alignItems: 'center', padding: '14px 28px',
           background: 'rgba(10, 10, 20, 0.95)', backdropFilter: 'blur(10px)',
           borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
           position: 'sticky', top: 0, zIndex: 100 },
    logoBox: { display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' },
    logoGlow: { position: 'absolute', width: '40px', height: '40px', background: 'rgba(0,212,255,0.1)', borderRadius: '10px', filter: 'blur(10px)' },
    logo: { fontSize: '18px', fontWeight: '700', color: '#00d4ff', letterSpacing: '-0.5px' },
    navLinks: { display: 'flex', gap: '24px' },
    navLink: { fontSize: '14px', color: '#888', cursor: 'pointer', paddingBottom: '6px', transition: 'all 0.2s' },
    navLinkActive: { color: '#00d4ff', borderBottom: '2px solid #00d4ff' },
    navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    karmaBox: { display: 'flex', alignItems: 'center', gap: '4px',
                background: 'rgba(0, 212, 255, 0.1)', padding: '5px 12px',
                borderRadius: '20px', border: '1px solid rgba(0,212,255,0.2)' },
    karmaIcon: { fontSize: '12px' },
    karmaText: { fontSize: '13px', color: '#00d4ff', fontWeight: '600' },
    btnLogout: { background: 'transparent', color: '#ff6b6b',
                 border: '1px solid #ff6b6b55', padding: '8px 16px',
                 borderRadius: '10px', cursor: 'pointer', fontSize: '13px',
                 fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s' },
    content: { maxWidth: '700px', margin: '0 auto', padding: '32px 20px' },
    header: { textAlign: 'center', marginBottom: '24px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#00d4ff',
             marginBottom: '8px', letterSpacing: '-0.5px' },
    subtitle: { color: '#6b6b8a', fontSize: '14px' },
    maPositionBox: { display: 'flex', alignItems: 'center', gap: '12px',
                     background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0,212,255,0.3)',
                     borderRadius: '12px', padding: '14px 20px',
                     marginBottom: '24px' },
    maPositionText: { color: '#888', fontSize: '14px' },
    maPositionRang: { fontSize: '20px', fontWeight: '700',
                      color: '#00d4ff', marginLeft: 'auto' },
    maPositionKarma: { fontSize: '14px', color: '#00d4ff' },
    podium: { display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
              gap: '12px', marginBottom: '32px' },
    podiumCard: { display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '16px', borderRadius: '16px', flex: 1 },
    podium1: { background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0,212,255,0.3)' },
    podium2: { background: 'rgba(0, 150, 200, 0.03)', border: '1px solid rgba(0,150,200,0.2)' },
    podium3: { background: 'rgba(0, 100, 150, 0.02)', border: '1px solid rgba(0,100,150,0.15)' },
    podiumMedal: { fontSize: '28px', marginBottom: '8px' },
    podiumAvatar: { width: '48px', height: '48px', borderRadius: '50%',
                    background: '#1a1a2a', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: '600',
                    marginBottom: '8px', color: '#e2e2e2' },
    podiumName: { fontSize: '14px', fontWeight: '600', color: '#e2e2e2',
                  textAlign: 'center', marginBottom: '4px' },
    podiumKarma: { fontSize: '13px', color: '#888', marginBottom: '4px' },
    podiumFiliere: { fontSize: '11px', color: '#555' },
    liste: { display: 'flex', flexDirection: 'column', gap: '8px' },
    listeItem: { display: 'flex', alignItems: 'center', gap: '14px',
                 background: '#0f0f17', border: '1px solid rgba(0,212,255,0.1)',
                 borderRadius: '14px', padding: '14px 16px' },
    rang: { width: '32px', textAlign: 'center', fontSize: '18px' },
    rangNum: { fontSize: '14px', color: '#555', fontWeight: '600' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '600', flexShrink: 0,
              color: '#e2e2e2' },
    info: { flex: 1 },
    infoNom: { fontSize: '14px', fontWeight: '500', color: '#e2e2e2',
               display: 'flex', alignItems: 'center', gap: '8px',
               marginBottom: '2px' },
    infoSub: { fontSize: '12px', color: '#555' },
    moiTag: { background: 'linear-gradient(135deg, #00d4ff, #0099cc)', color: '#0a0a0f', fontSize: '10px',
              padding: '2px 8px', borderRadius: '10px', fontWeight: '600' },
    karmaTag: { padding: '5px 12px', borderRadius: '20px',
                fontSize: '13px', fontWeight: '600', flexShrink: 0 },
};