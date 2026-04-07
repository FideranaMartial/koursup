import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const TYPE_COLORS = {
    COURS:   { bg: '#1e1b4b', text: '#a5b4fc' },
    RESUME:  { bg: '#1a2e1a', text: '#86efac' },
    ANNALE:  { bg: '#2d1b1b', text: '#fca5a5' },
    TD:      { bg: '#1a2535', text: '#93c5fd' },
    TP:      { bg: '#2d1f0e', text: '#fcd34d' },
    AUTRE:   { bg: '#1f1f2e', text: '#c4b5fd' },
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
            onNote(); // recharge la liste pour mettre à jour la moyenne
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
                        color: i <= (hover || maNote) ? '#EF9F27' : '#444',
                        transition: 'color 0.1s'
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
    const [showFiltres, setShowFiltres] = useState(false);
    const navigate = useNavigate();
    const { user, refreshUser, logout } = useAuth();

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
            const res = await api.get(`/documents/${id}/telecharger`,
                                      { responseType: 'blob' });
            const url = URL.createObjectURL(res.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = nom;
            a.click();
            toast.success('Téléchargement lancé !');
            charger();
        } catch {
            toast.error('Téléchargement lancé !');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={s.page}>
            {/* Navbar */}
            <div style={s.nav}>
                <div style={s.logoBox}>
                    <span style={s.logo}>KoursUp</span>
                </div>
                <div style={s.navRight}>
                    <div style={s.karmaBox}>
                        <span style={s.karmaIcon}>⚡</span>
                        <span style={s.karmaText}>{user?.karma || 0} pts</span>
                    </div>
                    <span style={s.userName}>{user?.prenom} {user?.nom}</span>
                    <button style={s.btnShare}
                            onClick={() => setShowUpload(!showUpload)}>
                        + Partager
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
                        <p style={s.emptyIcon}></p>
                        <p style={s.emptyText}>Aucun document trouvé</p>
                        <p style={s.emptySubText}>
                            Sois le premier à partager un cours !
                        </p>
                    </div>
                ) : documents.map(doc => {
                    const colors = TYPE_COLORS[doc.type] || TYPE_COLORS.AUTRE;
                    return (
                        <div key={doc.id} style={{...s.card, background: colors.bg}}>
                            <div style={{...s.typeBadge, color: colors.text,
                                        border: `1px solid ${colors.text}33`}}>
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
                            <button style={{...s.btnDl, color: colors.text,
                                           border: `1px solid ${colors.text}44`}}
                                    onClick={() => telecharger(doc.id, doc.nomFichier)}>
                                ⬇ Télécharger
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: '100vh', background: '#0f0f13', color: '#e2e2e2' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
           padding: '14px 28px', background: '#16161f',
           borderBottom: '1px solid #2a2a3a', position: 'sticky',
           top: 0, zIndex: 100 },
    logoBox: { display: 'flex', alignItems: 'center', gap: '10px' },
    logoDot: { width: '28px', height: '28px', borderRadius: '8px',
               background: '#534AB7' },
    logo: { fontSize: '18px', fontWeight: '700', color: '#a5b4fc' },
    navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    karmaBox: { display: 'flex', alignItems: 'center', gap: '4px',
                background: '#1e1b4b', padding: '5px 12px', borderRadius: '20px' },
    karmaIcon: { fontSize: '14px' },
    karmaText: { fontSize: '13px', color: '#a5b4fc', fontWeight: '600' },
    userName: { fontSize: '13px', color: '#888', marginRight: '4px' },
    btnShare: { background: '#534AB7', color: 'white', border: 'none',
                padding: '8px 18px', borderRadius: '8px',
                cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
    btnLogout: { background: 'transparent', color: '#f87171',
                 border: '1px solid #f8717155', padding: '8px 16px',
                 borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
    uploadBox: { background: '#16161f', margin: '20px 28px',
                 padding: '24px', borderRadius: '14px',
                 border: '1px solid #2a2a3a' },
    uploadTitle: { color: '#a5b4fc', marginBottom: '16px', fontSize: '16px' },
    uploadGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
    input: { width: '100%', padding: '10px 14px', background: '#0f0f13',
             border: '1px solid #2a2a3a', borderRadius: '8px',
             color: '#e2e2e2', fontSize: '14px', boxSizing: 'border-box' },
    fileName: { color: '#86efac', fontSize: '13px', margin: '8px 0' },
    uploadActions: { display: 'flex', gap: '10px',
                     justifyContent: 'flex-end', marginTop: '16px' },
    btnCancel: { background: 'transparent', color: '#888',
                 border: '1px solid #2a2a3a', padding: '8px 16px',
                 borderRadius: '8px', cursor: 'pointer' },
    searchSection: { padding: '20px 28px 8px' },
    searchRow: { display: 'flex', gap: '8px' },
    searchInput: { flex: 1, padding: '11px 16px', background: '#16161f',
                   border: '1px solid #2a2a3a', borderRadius: '10px',
                   color: '#e2e2e2', fontSize: '14px' },
    btnSearch: { background: '#534AB7', color: 'white', border: 'none',
                 padding: '11px 20px', borderRadius: '10px',
                 cursor: 'pointer', fontSize: '14px' },
    btnReset: { background: '#2a2a3a', color: '#888', border: 'none',
                padding: '11px 14px', borderRadius: '10px', cursor: 'pointer' },
    resultCount: { color: '#555', fontSize: '13px', margin: '8px 0 0' },
    grid: { display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '16px', padding: '16px 28px 40px' },
    emptyBox: { gridColumn: '1/-1', textAlign: 'center', padding: '4rem' },
    emptyIcon: { fontSize: '48px', marginBottom: '12px' },
    emptyText: { color: '#888', fontSize: '16px', marginBottom: '6px' },
    emptySubText: { color: '#555', fontSize: '14px' },
    card: { borderRadius: '14px', padding: '18px', border: '1px solid #ffffff0a' },
    typeBadge: { display: 'inline-block', fontSize: '11px', fontWeight: '600',
                 padding: '3px 10px', borderRadius: '20px',
                 marginBottom: '10px', letterSpacing: '0.05em' },
    cardTitle: { fontSize: '15px', fontWeight: '600', color: '#e2e2e2',
                 marginBottom: '8px', lineHeight: '1.4' },
    cardTags: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' },
    tag: { background: '#ffffff0a', color: '#888', fontSize: '11px',
           padding: '2px 8px', borderRadius: '10px' },
    cardDesc: { fontSize: '13px', color: '#666', marginBottom: '12px',
                lineHeight: '1.5' },
    cardStats: { display: 'flex', alignItems: 'center',
                 gap: '12px', marginBottom: '12px' },
    stat: { fontSize: '12px', color: '#666' },
    statAuteur: { marginLeft: 'auto', fontSize: '12px', color: '#555' },
    btnDl: { width: '100%', padding: '9px', background: 'transparent',
             borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
             fontWeight: '500' },
             filtresBox: { background: '#16161f', border: '1px solid #2a2a3a',
                borderRadius: '12px', padding: '16px', marginTop: '10px' },
  filtresGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
                 gap: '12px', alignItems: 'end' },
  filtreLabel: { display: 'block', fontSize: '12px', color: '#888',
                 marginBottom: '6px' },
  filtreSelect: { width: '100%', padding: '9px 12px', background: '#0f0f13',
                  border: '1px solid #2a2a3a', borderRadius: '8px',
                  color: '#e2e2e2', fontSize: '13px' },
  filtreActions: { display: 'flex', gap: '8px' },
  btnAppliquer: { background: '#534AB7', color: 'white', border: 'none',
                  padding: '9px 16px', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '13px' },
};