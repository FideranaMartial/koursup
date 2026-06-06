import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function CommentSection({ documentId }) {
    const [comments, setComments] = useState([]);
    const [contenu, setContenu] = useState('');
    const { user, refreshUser } = useAuth();

    useEffect(() => {
        charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentId]);

    const charger = async () => {
        try {
            const res = await api.get(`/documents/${documentId}/comments`);
            setComments(res.data);
        } catch {
            console.error('Erreur chargement commentaires');
        }
    };

    const commenter = async () => {
        if (!contenu.trim()) return;
        try {
            await api.post(
                `/documents/${documentId}/comments?contenu=${encodeURIComponent(contenu)}`
            );
            setContenu('');
            await charger();
            await refreshUser();
            toast.success('Commentaire ajouté ! +2 karma ⚡');
        } catch {
            toast.error('Erreur lors du commentaire');
        }
    };

    const supprimer = async (commentId) => {
        try {
            await api.delete(`/documents/comments/${commentId}`);
            await charger();
            await refreshUser();
            toast.success('Commentaire supprimé');
        } catch {
            toast.error('Erreur suppression');
        }
    };

    const formaterDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div style={s.container}>
            <h4 style={s.titre}>
                💬 Commentaires ({comments.length})
            </h4>

            {/* Zone de saisie */}
            <div style={s.inputRow}>
                <input
                    style={s.input}
                    placeholder="Ajouter un commentaire..."
                    value={contenu}
                    onChange={e => setContenu(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && commenter()}
                />
                <button style={s.btnEnvoyer} onClick={commenter}>
                    Envoyer
                </button>
            </div>

            {/* Liste des commentaires */}
            {comments.length === 0 ? (
                <p style={s.empty}>
                    Aucun commentaire — sois le premier !
                </p>
            ) : comments.map(c => (
                <div key={c.id} style={s.comment}>
                    <div style={s.commentHeader}>
                        <div style={s.avatar}>
                            {c.auteurPrenom[0]}{c.auteurNom[0]}
                        </div>
                        <div>
                            <div style={s.auteur}>
                                {c.auteurPrenom} {c.auteurNom}
                                {c.auteurEmail === user?.email && (
                                    <span style={s.moiTag}>Moi</span>
                                )}
                            </div>
                            <div style={s.date}>
                                {formaterDate(c.createdAt)}
                            </div>
                        </div>
                        {c.auteurEmail === user?.email && (
                            <button
                                style={s.btnDelete}
                                onClick={() => supprimer(c.id)}>
                                🗑
                            </button>
                        )}
                    </div>
                    <p style={s.contenu}>{c.contenu}</p>
                </div>
            ))}
        </div>
    );
}

const s = {
    container: {
        marginTop: '12px',
        borderTop: '1px solid #2a2a3a',
        paddingTop: '12px'
    },
    titre: {
        fontSize: '13px', color: '#a5b4fc',
        marginBottom: '10px', fontWeight: '600'
    },
    inputRow: {
        display: 'flex', gap: '8px', marginBottom: '12px'
    },
    input: {
        flex: 1, padding: '8px 12px', background: '#0f0f13',
        border: '1px solid #2a2a3a', borderRadius: '8px',
        color: '#e2e2e2', fontSize: '13px'
    },
    btnEnvoyer: {
        background: '#534AB7', color: 'white', border: 'none',
        padding: '8px 14px', borderRadius: '8px',
        cursor: 'pointer', fontSize: '12px'
    },
    empty: {
        color: '#555', fontSize: '12px', textAlign: 'center',
        padding: '12px'
    },
    comment: {
        background: '#0f0f13', borderRadius: '10px',
        padding: '10px 12px', marginBottom: '8px',
        border: '1px solid #2a2a3a'
    },
    commentHeader: {
        display: 'flex', alignItems: 'center',
        gap: '8px', marginBottom: '6px'
    },
    avatar: {
        width: '28px', height: '28px', borderRadius: '50%',
        background: '#2a2a3a', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '10px', color: '#e2e2e2', flexShrink: 0
    },
    auteur: {
        fontSize: '12px', color: '#e2e2e2',
        fontWeight: '500', display: 'flex',
        alignItems: 'center', gap: '6px'
    },
    date: { fontSize: '11px', color: '#555' },
    moiTag: {
        background: '#534AB7', color: 'white',
        fontSize: '9px', padding: '1px 6px', borderRadius: '8px'
    },
    btnDelete: {
        background: 'transparent', border: 'none',
        color: '#f87171', cursor: 'pointer',
        fontSize: '13px', marginLeft: 'auto'
    },
    contenu: { fontSize: '13px', color: '#aaa', lineHeight: '1.5' }
};