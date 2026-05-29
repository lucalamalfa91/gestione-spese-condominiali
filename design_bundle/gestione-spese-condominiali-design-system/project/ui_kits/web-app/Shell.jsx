/* App shell — nav rail, header, bottom nav, FAB */
const NAV = [
  { id: 'panoramica', icon: 'grid', label: 'Panoramica', sub: 'Riepilogo' },
  { id: 'movimenti', icon: 'euro', label: 'Movimenti', sub: 'Dovuti e versamenti' },
  { id: 'dati', icon: 'database', label: 'Dati', sub: 'Backup e archivio' },
  { id: 'impostazioni', icon: 'settings', label: 'Impostazioni', sub: 'Casa e account' },
];
const VIEW_HEAD = {
  panoramica: ['Panoramica', 'Riepilogo della casa selezionata'],
  movimenti: ['Movimenti', 'Dovuti, versamenti e import banca'],
  dati: ['Dati', 'Backup e registro movimenti'],
  impostazioni: ['Impostazioni', 'Immobili e account'],
};

function Shell({ view, setView, houses, selectedId, setSelectedId, email, onLogout, onToggleTheme, children }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [title, subtitle] = VIEW_HEAD[view];
  return (
    <div className="dashboard">
      <aside className="nav-rail" aria-label="Navigazione principale">
        <div className="brand compact">
          <div className="logo"><Icon name="house" size={22} stroke={1.8} /></div>
          <div className="brand-text"><strong>Condominio</strong><span className="muted">Gestione spese</span></div>
        </div>
        <nav className="nav-list">
          {NAV.map((n) => (
            <button key={n.id} type="button" className={`nav-btn ${view === n.id ? 'active' : ''}`} onClick={() => setView(n.id)}>
              <span className="nav-icon" aria-hidden="true"><Icon name={n.icon} size={20} /></span>
              <span className="nav-label"><strong>{n.label}</strong><span>{n.sub}</span></span>
            </button>
          ))}
        </nav>
      </aside>

      <header className="header">
        <div className="topbar-left">
          <div className="house-bar">
            <select className="house-select" value={selectedId} onChange={(e) => setSelectedId(e.target.value)} aria-label="Seleziona immobile">
              {houses.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
            <button className="btn-link" type="button">+ casa</button>
          </div>
          <div className="header-titles">
            <div className="page-title">{title}</div>
            <div className="muted">{subtitle}</div>
          </div>
        </div>
        <div className="header-actions">
          <div className="user-menu-wrap">
            <button className="user-chip" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
              <span>{email}</span>
              <Icon name="chevronDown" size={14} />
            </button>
            {menuOpen && (
              <div className="user-menu" role="menu">
                <button type="button" className="user-menu-item" onClick={() => { setView('impostazioni'); setMenuOpen(false); }}>Account</button>
                <button type="button" className="user-menu-item" onClick={() => { onToggleTheme(); setMenuOpen(false); }}>Cambia tema</button>
                <button type="button" className="user-menu-item user-menu-danger" onClick={onLogout}>Esci</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main">{children}</main>

      <nav className="bottom-nav" aria-label="Navigazione mobile">
        {NAV.map((n) => (
          <button key={n.id} type="button" className={`bottom-nav-btn ${view === n.id ? 'active' : ''}`} onClick={() => setView(n.id)}>
            <span className="nav-icon" aria-hidden="true"><Icon name={n.icon} size={22} /></span>
            <span>{n.label}</span>
          </button>
        ))}
      </nav>
      <button className="fab" type="button" aria-label="Aggiungi movimento" onClick={() => setView('movimenti')}>
        <Icon name="plus" size={24} stroke={2.5} />
      </button>
    </div>
  );
}
if (typeof window !== 'undefined') window.Shell = Shell;
