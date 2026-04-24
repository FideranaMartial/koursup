// components/Navbar.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div style={styles.nav}>
            <div style={styles.logoBox}>
                <div style={styles.logoGlow}></div>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                    <path d="M16 2L4 9L16 16L28 9L16 2Z" stroke="#00d4ff" strokeWidth="1.5" fill="none"/>
                    <path d="M4 16L16 23L28 16" stroke="#00d4ff" strokeWidth="1.5" fill="none"/>
                    <circle cx="16" cy="16" r="2" fill="#00d4ff"/>
                </svg>
                <span style={styles.logo}>KoursUp</span>
            </div>
            <div style={styles.navLinks}>
                <span 
                    style={{...styles.navLink, ...(isActive('/dashboard') ? styles.navLinkActive : {})}}
                    onClick={() => navigate('/dashboard')}
                >
                    Dashboard
                </span>
                <span 
                    style={{...styles.navLink, ...(isActive('/documents') ? styles.navLinkActive : {})}}
                    onClick={() => navigate('/documents')}
                >
                    Documents
                </span>
                <span 
                    style={{...styles.navLink, ...(isActive('/classement') ? styles.navLinkActive : {})}}
                    onClick={() => navigate('/classement')}
                >
                    Classement
                </span>
            </div>
            <div style={styles.navRight}>
                <div style={styles.karmaBox}>
                    <span>⚡</span>
                    <span style={styles.karmaText}>{user?.karma || 0} pts</span>
                </div>
                <button style={styles.btnLogout} onClick={handleLogout}>
                    Déconnexion
                </button>
            </div>
        </div>
        
    );
}

const styles = {
    nav: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '14px 28px', 
        background: 'rgba(10, 10, 20, 0.95)', 
        backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid rgba(0, 212, 255, 0.2)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100 
    },
    logoBox: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        position: 'relative' 
    },
    logoGlow: { 
        position: 'absolute', 
        width: '40px', 
        height: '40px', 
        background: 'rgba(0,212,255,0.1)', 
        borderRadius: '10px', 
        filter: 'blur(10px)' 
    },
    logo: { 
        fontSize: '18px', 
        fontWeight: '700', 
        color: '#00d4ff', 
        letterSpacing: '-0.5px' 
    },
    navLinks: { 
        display: 'flex', 
        gap: '24px' 
    },
    navLink: { 
        fontSize: '14px', 
        color: '#888', 
        cursor: 'pointer', 
        paddingBottom: '6px', 
        transition: 'all 0.2s' 
    },
    navLinkActive: { 
        color: '#00d4ff', 
        borderBottom: '2px solid #00d4ff' 
    },
    navRight: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px' 
    },
    karmaBox: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px', 
        background: 'rgba(0, 212, 255, 0.1)', 
        padding: '5px 12px', 
        borderRadius: '20px', 
        border: '1px solid rgba(0,212,255,0.2)' 
    },
    karmaText: { 
        fontSize: '13px', 
        color: '#00d4ff', 
        fontWeight: '600' 
    },
    btnLogout: { 
        background: 'transparent', 
        color: '#ff6b6b', 
        border: '1px solid #ff6b6b55', 
        padding: '8px 16px', 
        borderRadius: '10px', 
        cursor: 'pointer', 
        fontSize: '13px', 
        fontFamily: 'Space Grotesk, sans-serif' 
    }
};