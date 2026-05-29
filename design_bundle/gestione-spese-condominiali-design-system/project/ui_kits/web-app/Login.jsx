/* Login screen — Gestione Spese Condominiali */
function Login({ onLogin, onToggleTheme }) {
  const [email, setEmail] = React.useState('mario.rossi@email.it');
  const [pwd, setPwd] = React.useState('••••••••');
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">
          <div className="logo"><Icon name="house" size={24} stroke={1.8} /></div>
          <div>
            <div className="login-title">Gestione Spese Condominiali</div>
            <div className="login-subtitle">Accedi per gestire i tuoi immobili</div>
          </div>
        </div>
        <form className="login-form" onSubmit={(e) => { e.preventDefault(); onLogin(email); }}>
          <div>
            <label htmlFor="le">Email</label>
            <input id="le" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@email.it" />
          </div>
          <div>
            <label htmlFor="lp">Password</label>
            <input id="lp" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="La tua password" />
          </div>
          <button className="btn btn-primary" type="submit">Accedi</button>
        </form>
        <div className="login-footer">
          <span className="muted">Accesso riservato agli utenti registrati.</span>
          <button className="icon-btn" type="button" aria-label="Cambia tema" onClick={onToggleTheme}>
            <Icon name="sun" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
if (typeof window !== 'undefined') window.Login = Login;
