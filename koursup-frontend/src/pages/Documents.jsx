// Documents.jsx - Version corrigée
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';  // ← Ajout de useLocation
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const TYPE_COLORS = {
    COURS:   { bg: 'rgba(0, 212, 255, 0.05)', text: '#00d4ff', border: 'rgba(0,212,255,0.3)' },
    RESUME:  { bg: 'rgba(0, 200, 100, 0.05)', text: '#00e6a0', border: 'rgba(0,230,160,0.3)' },
    ANNALE:  { bg: 'rgba(255, 100, 100, 0.05)', text: '#ff6b6b', border: 'rgba(255,107,107,0.3)' },
    TD:      { bg: 'rgba(100, 100, 255, 0.05)', text: '#6b6bff', border: 'rgba(107,107,255,0.3)' },
    TP:      { bg: 'rgba(255, 180, 50, 0.05)', text: '#ffb432', border: 'rgba(255,180,50,0.3)' },
    AUTRE:   { bg: 'rgba(150, 100, 255, 0.05)', text: '#b86bff', border: 'rgba(184,107,255,0.3)' },
};

function Etoiles({ documentId, noteMoyenne, onNote }) {
    const [maNote, setMaNote] = useState(0);
    const [hover, setHover] = useState(0);
    

    useEffect(() => {
        api.get(`/documents/${documentId}/ma-note`)
           .then(res => setMaNote(res.data))
           .catch(() => {});
    }, [documentId]);

    const noter = async (note) => {
        try {
            await api.post(`/documents/${documentId}/noter?note=${note}`);
            setMaNote(note);
            onNote();
            toast.success('Note enregistrée !');
        } catch {
            toast.error('Erreur lors de la notation');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map(i => (
                <span
                    key={i}
                    style={{
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: i <= (hover || maNote) ? '#00d4ff' : '#333',
                        transition: 'color 0.1s',
                        textShadow: i <= (hover || maNote) ? '0 0 5px rgba(0,212,255,0.5)' : 'none'
                    }}
                    onClick={() => noter(i)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                >
                    ★
                </span>
            ))}
            <span style={{ fontSize: '11px', color: '#666', marginLeft: '4px' }}>
                {noteMoyenne.toFixed(1)}
            </span>
        </div>
    );
}

export default function Documents() {
    const [apercuDoc, setApercuDoc] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [fichier, setFichier] = useState(null);
    const [meta, setMeta] = useState({
        titre: '', description: '', filiere: '',
        niveau: '', matiere: '', type: 'COURS'
    });
    const [filtres, setFiltres] = useState({
        filiere: '',
        niveau: '',
        type: ''
    });
    const navigate = useNavigate();
    const location = useLocation();  // ← Ajout pour détecter la route active
    const { user, refreshUser, logout } = useAuth();

    // Fonction pour vérifier si un lien est actif
    const isActive = (path) => {
        return location.pathname === path;
    };

    useEffect(() => { charger(); }, []);

    const charger = async () => {
        try {
            const res = await api.get('/documents');
            setDocuments(res.data.content || []);
        } catch {
            toast.error('Erreur de chargement');
        }
    };

    const rechercher = async () => {
        if (!keyword.trim()) return charger();
        try {
            const res = await api.get(`/documents/recherche?keyword=${keyword}`);
            setDocuments(res.data.content || []);
        } catch {
            toast.error('Erreur de recherche');
        }
    };

    const filtrer = async () => {
        try {
            const params = new URLSearchParams();
            if (filtres.filiere) params.append('filiere', filtres.filiere);
            if (filtres.niveau) params.append('niveau', filtres.niveau);
            if (filtres.type) params.append('type', filtres.type);
            params.append('page', '0');
            params.append('size', '20');
    
            const res = await api.get(`/documents/filtrer?${params.toString()}`);
            setDocuments(res.data.content || []);
        } catch {
            toast.error('Erreur de filtrage');
        }
    };
    
    const resetFiltres = () => {
        setFiltres({ filiere: '', niveau: '', type: '' });
        charger();
    };

    const uploader = async () => {
        if (!fichier) return toast.error('Sélectionne un fichier');
        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(meta)],
                        { type: 'application/json' }));
        formData.append('fichier', fichier);
        try {
            await api.post('/documents', formData);
            await refreshUser();
            toast.success('Document uploadé ! +10 karma ⚡');
            setShowUpload(false);
            setFichier(null);
            setMeta({ titre: '', description: '', filiere: '',
                      niveau: '', matiere: '', type: 'COURS' });
            charger();
        } catch {
            toast.error("Erreur lors de l'upload");
        }
    };

    const telecharger = async (id, nom) => {
        try {
            await api.post(`/documents/${id}/incrementer-telechargement`);
            const res = await api.get(`/documents/${id}/fichier`,
                                      { responseType: 'blob' });
            const url = URL.createObjectURL(res.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = nom;
            a.click();
            toast.success('Téléchargement lancé !');
            charger();
        } catch {
            toast.success('Téléchargement lancé !');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce document ?')) return;
    try {
        await api.delete(`/documents/${id}`);
        toast.success('Document supprimé !');
        charger();
        await refreshUser(); // met à jour le karma
    } catch {
        toast.error('Erreur lors de la suppression');
    }
};

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
                    <span style={s.userName}>{user?.prenom} {user?.nom}</span>
                    <button style={s.btnShare}
                            onClick={() => setShowUpload(!showUpload)}>
                        Partager
                    </button>
                    <button style={s.btnLogout} onClick={handleLogout}>
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Upload Form */}
            {showUpload && (
                <div style={s.uploadBox}>
                    <h3 style={s.uploadTitle}>Partager un document</h3>
                    <div style={s.uploadGrid}>
                        {['titre', 'description', 'filiere', 'niveau', 'matiere'].map(f => (
                            <input key={f} style={s.input}
                                   placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                                   value={meta[f]}
                                   onChange={e => setMeta({...meta, [f]: e.target.value})}
                            />
                        ))}
                        <select style={s.input} value={meta.type}
                                onChange={e => setMeta({...meta, type: e.target.value})}>
                            {['COURS','RESUME','ANNALE','TD','TP','AUTRE'].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <input type="file" style={{...s.input, marginTop: '8px'}}
                           onChange={e => setFichier(e.target.files[0])} />
                    {fichier && (
                        <p style={s.fileName}>{fichier.name}</p>
                    )}
                    <div style={s.uploadActions}>
                        <button style={s.btnCancel}
                                onClick={() => setShowUpload(false)}>
                            Annuler
                        </button>
                        <button style={s.btnShare} onClick={uploader}>
                            Envoyer le document
                        </button>
                    </div>
                </div>
            )}

            {/* Recherche */}
            <div style={s.searchSection}>
                <div style={s.searchRow}>
                    <input style={s.searchInput}
                           placeholder="Rechercher un cours, matière, filière..."
                           value={keyword}
                           onChange={e => setKeyword(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && rechercher()}
                    />
                    <button style={s.btnSearch} onClick={rechercher}>
                        Rechercher
                    </button>
                    {keyword && (
                        <button style={s.btnReset} onClick={() => {
                            setKeyword(''); charger();
                        }}>✕</button>
                    )}
                </div>
                <div style={s.filtresBox}>
                    <div style={s.filtresGrid}>
                        <div>
                            <label style={s.filtreLabel}>Filière</label>
                            <select style={s.filtreSelect}
                                    value={filtres.filiere}
                                    onChange={e => setFiltres({
                                        ...filtres, filiere: e.target.value
                                    })}>
                                <option value="">Toutes</option>
                                <option>DA2I</option>
                                <option>AES</option>
                                <option>RPM</option>
                            </select>
                        </div>
                        <div>
                            <label style={s.filtreLabel}>Niveau</label>
                            <select style={s.filtreSelect}
                                    value={filtres.niveau}
                                    onChange={e => setFiltres({
                                        ...filtres, niveau: e.target.value
                                    })}>
                                <option value="">Tous</option>
                                <option>L1</option>
                                <option>L2</option>
                                <option>L3</option>
                                <option>M1</option>
                                <option>M2</option>
                            </select>
                        </div>
                        <div>
                            <label style={s.filtreLabel}>Type</label>
                            <select style={s.filtreSelect}
                                    value={filtres.type}
                                    onChange={e => setFiltres({
                                        ...filtres, type: e.target.value
                                    })}>
                                <option value="">Tous</option>
                                <option value="COURS">Cours</option>
                                <option value="RESUME">Résumé</option>
                                <option value="ANNALE">Annale</option>
                                <option value="TD">TD</option>
                                <option value="TP">TP</option>
                                <option value="AUTRE">Autre</option>
                            </select>
                        </div>
                        <div style={s.filtreActions}>
                            <button style={s.btnAppliquer} onClick={filtrer}>
                                Appliquer
                            </button>
                            <button style={s.btnReset} onClick={resetFiltres}>
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>
                <p style={s.resultCount}>{documents.length} document(s) trouvé(s)</p>
            </div>

            {/* Grid documents */}
            <div style={s.grid}>
                {documents.length === 0 ? (
                    <div style={s.emptyBox}>
                        <p style={s.emptyIcon}>📚</p>
                        <p style={s.emptyText}>Aucun document trouvé</p>
                        <p style={s.emptySubText}>
                            Sois le premier à partager un cours !
                        </p>
                    </div>
                ) : documents.map(doc => {
                    const colors = TYPE_COLORS[doc.type] || TYPE_COLORS.AUTRE;
                    return (
                        <div key={doc.id} style={{...s.card, background: colors.bg, border: `1px solid ${colors.border}`}}>
                            <div style={{...s.typeBadge, color: colors.text,
                                        border: `1px solid ${colors.border}`}}>
                                {doc.type}
                            </div>
                            <h3 style={s.cardTitle}>{doc.titre}</h3>
                            <div style={s.cardTags}>
                                <span style={s.tag}>{doc.filiere}</span>
                                <span style={s.tag}>{doc.niveau}</span>
                                <span style={s.tag}>{doc.matiere}</span>
                            </div>
                            {doc.description && (
                                <p style={s.cardDesc}>{doc.description}</p>
                            )}
                            <div style={s.cardStats}>
                                <Etoiles
                                    documentId={doc.id}
                                    noteMoyenne={doc.noteMoyenne}
                                    onNote={charger}
                                />
                                <span style={s.stat}>⬇ {doc.nombreTelechargements}</span>
                                <span style={s.statAuteur}>
                                    {doc.auteurPrenom} {doc.auteurNom}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                
                <button
                    style={{...s.btnDl, color: colors.text,
                            border: `1px solid ${colors.text}44`,
                            flex: 1}}
                    onClick={() => telecharger(doc.id, doc.nomFichier)}>
                    Télécharger
                </button>
                {doc.auteurEmail === user?.email && (
        <button
            style={{...s.btnDl, color: '#f87171',
                    border: '1px solid #f8717144', flex: 1}}
            onClick={() => supprimer(doc.id)}>
            Supprimer
        </button>
    )}
            </div>

                            
                        </div>
                    );
                })}
            </div>
            {apercuDoc && (
    <ApercuPDF
        documentId={apercuDoc.id}
        nomFichier={apercuDoc.nomFichier}
        onClose={() => setApercuDoc(null)}
    />
)}
        </div>
    );
}

const s = {
    page: { minHeight: '100vh', background: '#0a0a0f', color: '#e2e2e2', fontFamily: 'Space Grotesk, sans-serif' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
           padding: '14px 28px', background: 'rgba(10, 10, 20, 0.95)', backdropFilter: 'blur(10px)',
           borderBottom: '1px solid rgba(0, 212, 255, 0.2)', position: 'sticky',
           top: 0, zIndex: 100 },
    logoBox: { display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' },
    logoGlow: { position: 'absolute', width: '40px', height: '40px', background: 'rgba(0,212,255,0.1)', borderRadius: '10px', filter: 'blur(10px)' },
    logo: { fontSize: '18px', fontWeight: '700', color: '#00d4ff', letterSpacing: '-0.5px' },
    navLinks: { display: 'flex', gap: '24px' },
    navLink: { fontSize: '14px', color: '#888', cursor: 'pointer', paddingBottom: '6px', transition: 'all 0.2s' },
    navLinkActive: { color: '#00d4ff', borderBottom: '2px solid #00d4ff' },
    navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    karmaBox: { display: 'flex', alignItems: 'center', gap: '4px',
                background: 'rgba(0, 212, 255, 0.1)', padding: '5px 12px', borderRadius: '20px',
                border: '1px solid rgba(0,212,255,0.2)' },
    karmaIcon: { fontSize: '14px' },
    karmaText: { fontSize: '13px', color: '#00d4ff', fontWeight: '600' },
    userName: { fontSize: '13px', color: '#888', marginRight: '4px' },
    btnShare: { background: 'linear-gradient(135deg, #00d4ff, #0099cc)', color: 'white', border: 'none',
                padding: '8px 18px', borderRadius: '10px',
                cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s' },
    btnLogout: { background: 'transparent', color: '#ff6b6b',
                 border: '1px solid #ff6b6b55', padding: '8px 16px',
                 borderRadius: '10px', cursor: 'pointer', fontSize: '13px',
                 fontFamily: 'Space Grotesk, sans-serif' },
    uploadBox: { background: 'rgba(15, 15, 25, 0.9)', backdropFilter: 'blur(10px)', margin: '20px 28px',
                 padding: '24px', borderRadius: '20px',
                 border: '1px solid rgba(0, 212, 255, 0.3)' },
    uploadTitle: { color: '#00d4ff', marginBottom: '16px', fontSize: '16px', fontWeight: '600' },
    uploadGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
    input: { width: '100%', padding: '10px 14px', background: 'rgba(5, 5, 10, 0.8)',
             border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '10px',
             color: '#e2e2e2', fontSize: '14px', boxSizing: 'border-box',
             fontFamily: 'Space Grotesk, sans-serif' },
    fileName: { color: '#00d4ff', fontSize: '13px', margin: '8px 0' },
    uploadActions: { display: 'flex', gap: '10px',
                     justifyContent: 'flex-end', marginTop: '16px' },
    btnCancel: { background: 'transparent', color: '#888',
                 border: '1px solid #2a2a3a', padding: '8px 16px',
                 borderRadius: '10px', cursor: 'pointer',
                 fontFamily: 'Space Grotesk, sans-serif' },
    searchSection: { padding: '20px 28px 8px' },
    searchRow: { display: 'flex', gap: '8px' },
    searchInput: { flex: 1, padding: '11px 16px', background: 'rgba(15, 15, 25, 0.8)',
                   border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '12px',
                   color: '#e2e2e2', fontSize: '14px',
                   fontFamily: 'Space Grotesk, sans-serif' },
    btnSearch: { background: 'linear-gradient(135deg, #00d4ff, #0099cc)', color: 'white', border: 'none',
                 padding: '11px 20px', borderRadius: '12px',
                 cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                 fontFamily: 'Space Grotesk, sans-serif' },
    btnReset: { background: '#1a1a2a', color: '#888', border: 'none',
                padding: '11px 14px', borderRadius: '12px', cursor: 'pointer' },
    resultCount: { color: '#6b6b8a', fontSize: '13px', margin: '8px 0 0' },
    grid: { display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '16px', padding: '16px 28px 40px' },
    emptyBox: { gridColumn: '1/-1', textAlign: 'center', padding: '4rem' },
    emptyIcon: { fontSize: '48px', marginBottom: '12px' },
    emptyText: { color: '#888', fontSize: '16px', marginBottom: '6px' },
    emptySubText: { color: '#555', fontSize: '14px' },
    card: { borderRadius: '16px', padding: '18px', transition: 'all 0.2s ease' },
    typeBadge: { display: 'inline-block', fontSize: '11px', fontWeight: '600',
                 padding: '3px 10px', borderRadius: '20px',
                 marginBottom: '10px', letterSpacing: '0.05em' },
    cardTitle: { fontSize: '15px', fontWeight: '600', color: '#e2e2e2',
                 marginBottom: '8px', lineHeight: '1.4' },
    cardTags: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' },
    tag: { background: 'rgba(255,255,255,0.03)', color: '#888', fontSize: '11px',
           padding: '2px 8px', borderRadius: '10px' },
    cardDesc: { fontSize: '13px', color: '#666', marginBottom: '12px',
                lineHeight: '1.5' },
    cardStats: { display: 'flex', alignItems: 'center',
                 gap: '12px', marginBottom: '12px' },
    stat: { fontSize: '12px', color: '#666' },
    statAuteur: { marginLeft: 'auto', fontSize: '12px', color: '#555' },
    btnDl: { width: '100%', padding: '9px', background: 'transparent',
             borderRadius: '10px', cursor: 'pointer', fontSize: '13px',
             fontWeight: '600', transition: 'all 0.2s' },
    filtresBox: { background: 'rgba(15, 15, 25, 0.8)', border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: '16px', padding: '16px', marginTop: '10px' },
    filtresGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
                 gap: '12px', alignItems: 'end' },
    filtreLabel: { display: 'block', fontSize: '12px', color: '#888',
                 marginBottom: '6px', fontWeight: '500' },
    filtreSelect: { width: '100%', padding: '9px 12px', background: 'rgba(5, 5, 10, 0.8)',
                  border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '10px',
                  color: '#e2e2e2', fontSize: '13px',
                  fontFamily: 'Space Grotesk, sans-serif' },
    filtreActions: { display: 'flex', gap: '8px' },
    btnAppliquer: { background: 'linear-gradient(135deg, #00d4ff, #0099cc)', color: 'white', border: 'none',
                  padding: '9px 16px', borderRadius: '10px',
                  cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                  fontFamily: 'Space Grotesk, sans-serif' },
};