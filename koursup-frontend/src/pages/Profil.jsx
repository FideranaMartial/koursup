import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const BADGE_CONFIG = {
    EXPERT:       { color: '#00d4ff', bg: 'rgba(0, 212, 255, 0.15)', icon: '👑' },
    CONTRIBUTEUR: { color: '#a5b4fc', bg: 'rgba(165, 180, 252, 0.1)', icon: '⭐' },
    ACTIF:        { color: '#86efac', bg: 'rgba(134, 239, 172, 0.1)', icon: '🔥' },
    DEBUTANT:     { color: '#6b6b8a', bg: 'rgba(107, 107, 138, 0.1)', icon: '🌱' },
};

export default function Profil() {
    const [stats, setStats] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        nom: '', prenom: '', filiere: '', niveau: ''
    });
    const navigate = useNavigate();  
    
    const chargerStats = async () => {
        try {
            const res = await api.get('/users/me/stats');
            setStats(res.data);
            setForm({
                nom: res.data.nom,
                prenom: res.data.prenom,
                filiere: res.data.filiere || '',
                niveau: res.data.niveau || ''
            });
        } catch { toast.error('Erreur chargement profil'); }
    };

    
        const chargerDocuments = async () => {
            try {
                const res = await api.get('/users/me/documents');
                setDocuments(res.data);
            } catch { toast.error('Erreur chargement documents'); }
        };
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        chargerStats();
        chargerDocuments();
    }, []);


    const sauvegarder = async () => {
        try {
            await api.put('/users/me', form);
            // eslint-disable-next-line no-undef
            await refreshUser();
            await chargerStats();
            setEditMode(false);
            toast.success('Profil mis à jour !');
        } catch { toast.error('Erreur mise à jour'); }
    };

    

    if (!stats) return (
        <div style={s.loadingContainer}>
            <div style={s.loader}></div>
            <p style={s.loadingText}>Chargement du profil...</p>
        </div>
    );

    const badge = BADGE_CONFIG[stats.badge] || BADGE_CONFIG.DEBUTANT;

    return (
        <div style={s.page}>
            {/* Navbar */}
            <Navbar></Navbar>

            <div style={s.content}>
                {/* Header profil */}
                <div style={s.profileCard}>
                    <div style={s.avatarLarge}>
                        {stats.prenom?.[0]}{stats.nom?.[0]}
                    </div>
                    <div style={s.profileInfo}>
                        <div style={s.profileName}>
                            {stats.prenom} {stats.nom}
                            <span style={{
                                ...s.badgeTag,
                                background: badge.bg,
                                color: badge.color,
                                border: `1px solid ${badge.color}33`
                            }}>
                                {badge.icon} {stats.badge}
                            </span>
                        </div>
                        <div style={s.profileEmail}>{stats.email}</div>
                        <div style={s.profileSub}>
                            {stats.filiere && <span style={s.tag}>{stats.filiere}</span>}
                            {stats.niveau && <span style={s.tag}>{stats.niveau}</span>}
                        </div>
                    </div>
                    <button style={s.btnEdit}
                            onClick={() => setEditMode(!editMode)}>
                        {editMode ? '✕ Annuler' : '✏️ Modifier'}
                    </button>
                </div>

                {/* Formulaire d'édition */}
                {editMode && (
                    <div style={s.editCard}>
                        <h3 style={s.editTitle}>Modifier le profil</h3>
                        <div style={s.editGrid}>
                            <div>
                                <label style={s.label}>Nom</label>
                                <input style={s.input} value={form.nom}
                                       onChange={e => setForm({
                                           ...form, nom: e.target.value
                                       })} />
                            </div>
                            <div>
                                <label style={s.label}>Prénom</label>
                                <input style={s.input} value={form.prenom}
                                       onChange={e => setForm({
                                           ...form, prenom: e.target.value
                                       })} />
                            </div>
                            <div>
                                <label style={s.label}>Filière</label>
                                <input style={s.input} value={form.filiere}
                                       onChange={e => setForm({
                                           ...form, filiere: e.target.value
                                       })} />
                            </div>
                            <div>
                                <label style={s.label}>Niveau</label>
                                <select style={s.input} value={form.niveau}
                                        onChange={e => setForm({
                                            ...form, niveau: e.target.value
                                        })}>
                                    <option value="">--</option>
                                    <option>L1</option>
                                    <option>L2</option>
                                    <option>L3</option>
                                    <option>M1</option>
                                    <option>M2</option>
                                </select>
                            </div>
                        </div>
                        <button style={s.btnSave} onClick={sauvegarder}>
                            💾 Sauvegarder
                        </button>
                    </div>
                )}

                {/* Stats */}
                <div style={s.statsGrid}>
                    <div style={s.statCard}>
                        <div style={s.statIcon}><img src="/karma.png" alt="karma" /></div>
                        <div style={{...s.statValue, color: '#00d4ff'}}>
                            {stats.karma}
                        </div>
                        <div style={s.statLabel}>Points Karma</div>
                        <div style={s.progressBar}>
                            <div style={{
                                ...s.progressFill,
                                width: `${Math.min(100, (stats.karma / 500) * 100)}%`
                            }}></div>
                        </div>
                        <div style={s.progressLabel}>
                            {stats.karma < 50 && `${50 - stats.karma} pts → Actif`}
                            {stats.karma >= 50 && stats.karma < 200 && `${200 - stats.karma} pts → Contributeur`}
                            {stats.karma >= 200 && stats.karma < 500 && `${500 - stats.karma} pts → Expert`}
                            {stats.karma >= 500 && '🎉 Niveau maximum atteint !'}
                        </div>
                    </div>
                    <div style={s.statCard}>
                        <div style={s.statIcon}><img src="/documents.png" alt="documents" /></div>
                        <div style={s.statValue}>{stats.totalDocuments}</div>
                        <div style={s.statLabel}>Documents partagés</div>
                    </div>
                    <div style={s.statCard}>
                        <div style={s.statIcon}><img src="/download-30.png" alt="download" /></div>
                        <div style={s.statValue}>{stats.totalTelechargements}</div>
                        <div style={s.statLabel}>Téléchargements reçus</div>
                    </div>
                </div>

                {/* Mes documents */}
                <div style={s.section}>
                    <h3 style={s.sectionTitle}>
                        Mes documents ({documents.length})
                    </h3>
                    {documents.length === 0 ? (
                        <div style={s.emptyBox}>
                            <p style={s.emptyIcon}>📭</p>
                            <p style={s.emptyText}>
                                Tu n'as pas encore partagé de document
                            </p>
                            <button style={s.btnShare}
                                    onClick={() => navigate('/documents')}>
                                Partager mon premier cours
                            </button>
                        </div>
                    ) : (
                        <div style={s.docList}>
                            {documents.map(doc => (
                                <div key={doc.id} style={s.docItem}>
                                    <div style={s.docLeft}>
                                        <span style={{
                                            ...s.typeBadge,
                                            background: 'rgba(0, 212, 255, 0.1)',
                                            color: '#00d4ff',
                                            border: '1px solid rgba(0,212,255,0.3)'
                                        }}>
                                            {doc.type}
                                        </span>
                                        <div>
                                            <div style={s.docTitle}>
                                                {doc.titre}
                                            </div>
                                            <div style={s.docMeta}>
                                                {doc.filiere} · {doc.niveau}
                                                · {doc.matiere}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={s.docRight}>
                                        <span style={s.docStat}>
                                            <img src="/star.png" alt="star" /> {doc.noteMoyenne?.toFixed(1) || 0}
                                        </span>
                                        <span style={s.docStat}>
                                            <img src="/download.png" alt="download" /> {doc.nombreTelechargements}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: '100vh', background: '#0a0a0f', color: '#e2e2e2', fontFamily: 'Space Grotesk, sans-serif' },
    
    // Loading
    loadingContainer: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0f' },
    loader: { width: '50px', height: '50px', border: '3px solid rgba(0,212,255,0.2)', borderTop: '3px solid #00d4ff', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    loadingText: { marginTop: '20px', color: '#6b6b8a' },
    
    // Navbar
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 28px', background: 'rgba(10, 10, 20, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0, 212, 255, 0.2)', position: 'sticky', top: 0, zIndex: 100 },
    logoBox: { display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' },
    logoGlow: { position: 'absolute', width: '40px', height: '40px', background: 'rgba(0,212,255,0.1)', borderRadius: '10px', filter: 'blur(10px)' },
    logo: { fontSize: '18px', fontWeight: '700', color: '#00d4ff', letterSpacing: '-0.5px' },
    navLinks: { display: 'flex', gap: '24px' },
    navLink: { fontSize: '14px', color: '#888', cursor: 'pointer', paddingBottom: '6px', transition: 'all 0.2s' },
    navLinkActive: { color: '#00d4ff', borderBottom: '2px solid #00d4ff' },
    navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    karmaBox: { display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 212, 255, 0.1)', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(0,212,255,0.2)' },
    karmaText: { fontSize: '13px', color: '#00d4ff', fontWeight: '600' },
    btnLogout: { background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b55', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' },
    
    // Content
    content: { maxWidth: '860px', margin: '0 auto', padding: '32px 20px' },
    
    // Profile Card
    profileCard: { display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(15, 15, 25, 0.8)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '20px', padding: '24px', marginBottom: '20px', backdropFilter: 'blur(10px)' },
    avatarLarge: { width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #00d4ff, #0099cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700', color: '#0a0a0f', flexShrink: 0, boxShadow: '0 0 15px rgba(0,212,255,0.3)' },
    profileInfo: { flex: 1 },
    profileName: { fontSize: '20px', fontWeight: '700', color: '#e2e2e2', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' },
    badgeTag: { fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: '600', backdropFilter: 'blur(5px)' },
    profileEmail: { fontSize: '13px', color: '#6b6b8a', marginBottom: '8px' },
    profileSub: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    tag: { background: 'rgba(255,255,255,0.03)', color: '#888', fontSize: '12px', padding: '4px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' },
    btnEdit: { background: 'transparent', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s' },
    
    // Edit Card
    editCard: { background: 'rgba(15, 15, 25, 0.8)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '16px', padding: '20px', marginBottom: '20px', backdropFilter: 'blur(10px)' },
    editTitle: { color: '#00d4ff', marginBottom: '16px', fontSize: '16px', fontWeight: '600' },
    editGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' },
    label: { display: 'block', fontSize: '12px', color: '#6b6b8a', marginBottom: '6px', fontWeight: '500' },
    input: { width: '100%', padding: '10px 14px', background: 'rgba(5, 5, 10, 0.8)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '10px', color: '#e2e2e2', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif', boxSizing: 'border-box', transition: 'all 0.2s' },
    btnSave: { background: 'linear-gradient(135deg, #00d4ff, #0099cc)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'Space Grotesk, sans-serif' },
    
    // Stats Grid
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
    statCard: { background: 'rgba(15, 15, 25, 0.8)', border: '1px solid rgba(0, 212, 255, 0.1)', borderRadius: '16px', padding: '20px', textAlign: 'center', transition: 'transform 0.2s' },
    statIcon: { fontSize: '32px', marginBottom: '8px' },
    statValue: { fontSize: '32px', fontWeight: '800', color: '#00d4ff', marginBottom: '4px' },
    statLabel: { fontSize: '12px', color: '#6b6b8a', marginBottom: '12px' },
    progressBar: { background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '6px', marginBottom: '8px', overflow: 'hidden' },
    progressFill: { background: 'linear-gradient(90deg, #00d4ff, #0099cc)', height: '100%', borderRadius: '10px', transition: 'width 0.5s' },
    progressLabel: { fontSize: '10px', color: '#6b6b8a' },
    
    // Section documents
    section: { background: 'rgba(15, 15, 25, 0.8)', border: '1px solid rgba(0, 212, 255, 0.1)', borderRadius: '16px', padding: '20px' },
    sectionTitle: { color: '#e2e2e2', marginBottom: '16px', fontSize: '16px', fontWeight: '600' },
    
    // Empty state
    emptyBox: { textAlign: 'center', padding: '48px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
    emptyIcon: { fontSize: '48px', marginBottom: '8px' },
    emptyText: { color: '#6b6b8a', fontSize: '14px' },
    btnShare: { background: 'transparent', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', fontFamily: 'Space Grotesk, sans-serif', marginTop: '8px' },
    
    // Document list
    docList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    docItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(5, 5, 10, 0.6)', borderRadius: '12px', border: '1px solid rgba(0, 212, 255, 0.1)' },
    docLeft: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
    typeBadge: { fontSize: '10px', padding: '4px 10px', borderRadius: '10px', fontWeight: '600', flexShrink: 0 },
    docTitle: { fontSize: '14px', color: '#e2e2e2', fontWeight: '500', marginBottom: '2px' },
    docMeta: { fontSize: '11px', color: '#6b6b8a' },
    docRight: { display: 'flex', gap: '12px', alignItems: 'center' },
    docStat: { fontSize: '12px', color: '#6b6b8a', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '8px' },
};

// Animation CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);