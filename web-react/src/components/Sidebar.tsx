import { NavLink } from 'react-router-dom';
import { Home, Users, BarChart2, Activity, ShieldHalf } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/jogadores', icon: Users, label: 'Vitrine de Jogadores' },
    { to: '/scout', icon: Activity, label: 'Análise de Jogo' },
    { to: '/rankings', icon: BarChart2, label: 'Rankings' },
    { to: '/patrocinio', icon: ShieldHalf, label: 'Patrocínios (Em Breve)' },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <div style={styles.logo}>CH</div>
        <h2 style={{ fontSize: '1.2rem' }}>
          Capixaba <span className="text-gradient">Hub</span>
        </h2>
      </div>

      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {}),
            })}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={styles.footer}>
        <div style={styles.userProfile}>
          <div style={styles.avatar}>T</div>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Técnico Demo</p>
            <p className="text-secondary" style={{ fontSize: '0.8rem' }}>Acesso Pro</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    height: '100vh',
    position: 'fixed' as const,
    left: 0,
    top: 0,
    background: 'var(--bg-surface)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: 100,
  },
  logoContainer: {
    padding: '2rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logo: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    color: '#000',
    fontSize: '1.2rem',
  },
  nav: {
    flex: 1,
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'all var(--transition-fast)',
  },
  navLinkActive: {
    background: 'rgba(0, 255, 136, 0.1)',
    color: 'var(--accent-primary)',
    fontWeight: 600,
  },
  footer: {
    padding: '1.5rem',
    borderTop: '1px solid var(--border-color)',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
  }
};

export default Sidebar;
