import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // ← Ajout de useLocation
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();  // ← Ajout pour détecter la route active
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        totalDocuments: 0,
        meilleurNote: null,
        plusTelecharge: null,
        topContributeur: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        chargerDashboard();
    }, []);

    const chargerDashboard = async () => {
        setLoading(true);
        try {
            const res = await api.get('/dashboard/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Erreur:', err);
            toast.error('Erreur lors du chargement du dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Fonction pour vérifier si un lien est actif
    const isActive = (path) => {
        return location.pathname === path;
    };

    if (loading) {
        return (
            <div style={s.loadingContainer}>
                <div style={s.loader}></div>
                <p style={s.loadingText}>Chargement du tableau de bord...</p>
            </div>
        );
    }

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
                        <span>⚡</span>
                        <span style={s.karmaText}>{user?.karma || 0} pts</span>
                    </div>
                    <button style={s.btnLogout} onClick={handleLogout}>
                        Déconnexion
                    </button>
                </div>
            </div>

            <div style={s.content}>
                {/* Hero Section */}
                <div style={s.heroSection}>
                    <h1 style={s.heroTitle}>Tableau de bord</h1>
                    <p style={s.heroSubtitle}>Bienvenue {user?.prenom} ! Voici la vue d'ensemble de la plateforme</p>
                </div>

                {/* Carte principale : Nombre total de documents */}
                <div style={s.mainCard}>
                    
                    <div style={s.mainCardContent}>
                        <div style={s.mainCardValue}>{stats.totalDocuments}</div>
                        <div style={s.mainCardLabel}>documents disponibles</div>
                    </div>
                </div>

                {/* Deux cartes : Meilleur noté et Plus téléchargé */}
                <div style={s.twoColumns}>
                    {/* Document le mieux noté */}
                    <div style={s.infoCard}>
                        <div style={s.cardHeader}>
                            
                            <h3 style={s.cardTitle}>Mieux noté</h3>
                        </div>
                        {stats.meilleurNote ? (
                            <div style={s.cardContent}>
                                <h4 style={s.documentTitle}>{stats.meilleurNote.titre}</h4>
                                <p style={s.documentMeta}>
                                    {stats.meilleurNote.filiere} · {stats.meilleurNote.niveau} · {stats.meilleurNote.matiere}
                                </p>
                                <div style={s.ratingBox}>
                                    <span style={s.stars}>★</span>
                                    <span style={s.ratingValue}>{stats.meilleurNote.noteMoyenne.toFixed(1)}</span>
                                    <span style={s.ratingMax}>/5</span>
                                </div>
                                <p style={s.authorName}>
                                    par {stats.meilleurNote.auteurPrenom} {stats.meilleurNote.auteurNom}
                                </p>
                                <button 
                                    style={s.viewButton}
                                    onClick={() => navigate('/documents')}
                                >
                                    Voir le document
                                </button>
                            </div>
                        ) : (
                            <p style={s.emptyText}>Aucun document noté pour le moment</p>
                        )}
                    </div>

                    {/* Document le plus téléchargé */}
                    <div style={s.infoCard}>
                        <div style={s.cardHeader}>
                            
                            <h3 style={s.cardTitle}>Plus téléchargé</h3>
                        </div>
                        {stats.plusTelecharge ? (
                            <div style={s.cardContent}>
                                <h4 style={s.documentTitle}>{stats.plusTelecharge.titre}</h4>
                                <p style={s.documentMeta}>
                                    {stats.plusTelecharge.filiere} · {stats.plusTelecharge.niveau} · {stats.plusTelecharge.matiere}
                                </p>
                                <div style={s.downloadBox}>
                                    
                                    <span style={s.downloadValue}>{stats.plusTelecharge.nombreTelechargements}</span>
                                    <span style={s.downloadLabel}>téléchargements</span>
                                </div>
                                <p style={s.authorName}>
                                    par {stats.plusTelecharge.auteurPrenom} {stats.plusTelecharge.auteurNom}
                                </p>
                                <button 
                                    style={s.viewButton}
                                    onClick={() => navigate('/documents')}
                                >
                                    Voir le document
                                </button>
                            </div>
                        ) : (
                            <p style={s.emptyText}>Aucun document téléchargé pour le moment</p>
                        )}
                    </div>
                </div>

                {/* Top Contributeur */}
                <div style={s.topContributorCard}>
                    <div style={s.topContributorHeader}>
                        
                        <h3 style={s.topContributorTitle}>Top Contributeur</h3>
                    </div>
                    {stats.topContributeur ? (
                        <div style={s.topContributorContent}>
                            <div style={s.topContributorAvatar}>
                                {stats.topContributeur.prenom?.[0]}{stats.topContributeur.nom?.[0]}
                            </div>
                            <div style={s.topContributorInfo}>
                                <h4 style={s.topContributorName}>
                                    {stats.topContributeur.prenom} {stats.topContributeur.nom}
                                </h4>
                                <p style={s.topContributorMeta}>
                                    {stats.topContributeur.filiere} · {stats.topContributeur.nombreDocuments} documents
                                </p>
                                <div style={s.topContributorKarma}>
                                    <span style={s.karmaIcon}>⚡</span>
                                    <span style={s.karmaValue}>{stats.topContributeur.karma} points de karma</span>
                                </div>
                            </div>
                            <button 
                                style={s.profileButton}
                                onClick={() => navigate('/classement')}
                            >
                                Voir le classement
                            </button>
                        </div>
                    ) : (
                        <p style={s.emptyText}>Aucun contributeur pour le moment</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: '100vh', background: '#0a0a0f', color: '#e2e2e2', fontFamily: 'Space Grotesk, sans-serif' },
    loadingContainer: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0f' },
    loader: { width: '50px', height: '50px', border: '3px solid rgba(0,212,255,0.2)', borderTop: '3px solid #00d4ff', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    loadingText: { marginTop: '20px', color: '#6b6b8a' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 28px', background: 'rgba(10, 10, 20, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0, 212, 255, 0.2)', position: 'sticky', top: 0, zIndex: 100 },
    logoBox: { display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' },
    logoGlow: { position: 'absolute', width: '40px', height: '40px', background: 'rgba(0,212,255,0.1)', borderRadius: '10px', filter: 'blur(10px)' },
    logo: { fontSize: '18px', fontWeight: '700', color: '#00d4ff', letterSpacing: '-0.5px' },
    navLinks: { display: 'flex', gap: '24px' },
    navLink: { fontSize: '14px', color: '#888', cursor: 'pointer', paddingBottom: '6px', transition: 'all 0.2s' },
    navLinkActive: { color: '#00d4ff', borderBottom: '2px solid #00d4ff' },  // ← Ajout du style pour l'onglet actif
    navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    karmaBox: { display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 212, 255, 0.1)', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(0,212,255,0.2)' },
    karmaText: { fontSize: '13px', color: '#00d4ff', fontWeight: '600' },
    btnLogout: { background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b55', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' },
    content: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
    heroSection: { textAlign: 'center', marginBottom: '40px' },
    heroTitle: { fontSize: '32px', fontWeight: '700', color: '#00d4ff', marginBottom: '8px' },
    heroSubtitle: { fontSize: '14px', color: '#6b6b8a' },
    mainCard: { background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,150,200,0.05))', borderRadius: '24px', padding: '40px', textAlign: 'center', marginBottom: '32px', border: '1px solid rgba(0,212,255,0.3)' },
    mainCardIcon: { fontSize: '48px', marginBottom: '16px' },
    mainCardValue: { fontSize: '56px', fontWeight: '800', color: '#00d4ff', marginBottom: '8px' },
    mainCardLabel: { fontSize: '16px', color: '#6b6b8a' },
    twoColumns: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' },
    infoCard: { background: 'rgba(15, 15, 25, 0.8)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(0,212,255,0.1)' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
    cardIcon: { fontSize: '24px' },
    cardTitle: { fontSize: '18px', fontWeight: '600', color: '#00d4ff', margin: 0 },
    cardContent: {},
    documentTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#e2e2e2' },
    documentMeta: { fontSize: '12px', color: '#6b6b8a', marginBottom: '12px' },
    ratingBox: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' },
    stars: { fontSize: '18px', color: '#00d4ff' },
    ratingValue: { fontSize: '18px', fontWeight: '700', color: '#00d4ff' },
    ratingMax: { fontSize: '12px', color: '#6b6b8a' },
    downloadBox: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' },
    downloadIcon: { fontSize: '16px' },
    downloadValue: { fontSize: '18px', fontWeight: '700', color: '#00d4ff' },
    downloadLabel: { fontSize: '12px', color: '#6b6b8a' },
    authorName: { fontSize: '12px', color: '#888', marginBottom: '16px' },
    viewButton: { width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '10px', color: '#00d4ff', cursor: 'pointer', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s' },
    topContributorCard: { background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,100,150,0.05))', borderRadius: '20px', padding: '24px', border: '1px solid rgba(0,212,255,0.2)' },
    topContributorHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
    topContributorIcon: { fontSize: '28px' },
    topContributorTitle: { fontSize: '18px', fontWeight: '600', color: '#00d4ff', margin: 0 },
    topContributorContent: { display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' },
    topContributorAvatar: { width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #00d4ff, #0099cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700', color: '#0a0a0f' },
    topContributorInfo: { flex: 1 },
    topContributorName: { fontSize: '18px', fontWeight: '700', marginBottom: '4px' },
    topContributorMeta: { fontSize: '13px', color: '#6b6b8a', marginBottom: '8px' },
    topContributorKarma: { display: 'flex', alignItems: 'center', gap: '6px' },
    karmaIcon: { fontSize: '14px' },
    karmaValue: { fontSize: '14px', fontWeight: '600', color: '#00d4ff' },
    profileButton: { padding: '10px 24px', background: 'transparent', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '10px', color: '#00d4ff', cursor: 'pointer', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' },
    emptyText: { textAlign: 'center', padding: '40px', color: '#6b6b8a' }
};

// Ajouter l'animation CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);