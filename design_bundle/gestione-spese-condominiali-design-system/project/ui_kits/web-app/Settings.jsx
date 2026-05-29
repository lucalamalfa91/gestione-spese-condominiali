/* Dati + Impostazioni views */
function Dati() {
  const [tab, setTab] = React.useState('backup');
  return (
    <section className="view active">
      <nav className="sub-nav" role="tablist">
        <button className={`sub-nav-btn ${tab === 'backup' ? 'active' : ''}`} onClick={() => setTab('backup')}>Backup</button>
        <button className={`sub-nav-btn ${tab === 'registro' ? 'active' : ''}`} onClick={() => setTab('registro')}>Registro</button>
      </nav>
      {tab === 'backup' ? (
        <div className="card stack">
          <div className="panel-head"><div><h2>Backup e dati</h2><p className="subtle">Esporta o importa backup JSON.</p></div></div>
          <div className="toolbar">
            <label className="btn btn-secondary">Importa JSON</label>
            <button className="btn btn-secondary" type="button">Esporta JSON</button>
          </div>
          <p className="muted">Export v2 (schemaVersion 2). Import richiede login e sincronizza su Supabase.</p>
        </div>
      ) : (
        <div className="card"><div className="panel-head"><div><h2>Registro movimenti</h2><p className="subtle">Dovuti e versamenti della casa selezionata.</p></div></div>
          <div className="table-scroll"><div className="empty">Seleziona una casa per vedere il registro completo.</div></div>
        </div>
      )}
    </section>
  );
}

function Impostazioni({ houses, selectedId, setSelectedId, email }) {
  const [tab, setTab] = React.useState('casa');
  const sel = houses.find((h) => h.id === selectedId) || houses[0];
  return (
    <section className="view active">
      <nav className="sub-nav" role="tablist">
        <button className={`sub-nav-btn ${tab === 'casa' ? 'active' : ''}`} onClick={() => setTab('casa')}>Immobili</button>
        <button className={`sub-nav-btn ${tab === 'account' ? 'active' : ''}`} onClick={() => setTab('account')}>Account</button>
      </nav>
      {tab === 'casa' ? (
        <div className="forms house-manage-layout">
          <div className="card stack">
            <div className="panel-head"><div><h2>I tuoi immobili</h2><p className="subtle">Seleziona una casa da modificare o eliminare.</p></div>
              <button className="btn btn-secondary" type="button">+ Nuova casa</button></div>
            <div className="house-list compact">
              {houses.map((h) => {
                const t = houseTotals(h);
                return (
                  <button key={h.id} type="button" className={`house-btn ${h.id === selectedId ? 'active' : ''}`} onClick={() => setSelectedId(h.id)}>
                    <strong>{h.name}</strong>
                    <span className="muted">{h.location || 'Località non indicata'}</span>
                    <span className="muted">Saldo: {fmtSigned(t.balance)}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="card stack">
            <div className="panel-head"><div><h2>Modifica immobile</h2><p className="subtle">Dati e configurazione esercizio fiscale.</p></div></div>
            <form className="stack" onSubmit={(e) => e.preventDefault()}>
              <div className="field-grid">
                <div><label>Nome casa</label><input defaultValue={sel.name} key={sel.id + 'n'} /></div>
                <div><label>Località</label><input defaultValue={sel.location} key={sel.id + 'l'} /></div>
              </div>
              <div className="field-grid">
                <div><label>Mese inizio esercizio</label>
                  <select defaultValue={String(sel.fiscalStartMonth)} key={sel.id + 'm'}>
                    <option value="1">Gennaio (anno solare)</option>
                    <option value="6">Giugno (es. 2024/2025)</option>
                    <option value="7">Luglio</option>
                    <option value="9">Settembre</option>
                  </select>
                </div>
              </div>
              <div><label>Note</label><textarea placeholder="Amministratore, millesimi, appunti…"></textarea></div>
              <div className="form-actions"><button className="btn btn-primary" type="submit">Salva modifiche</button><button className="btn btn-danger" type="button">Elimina casa</button></div>
            </form>
          </div>
        </div>
      ) : (
        <div className="forms">
          <div className="card stack">
            <div className="panel-head"><div><h2>Cambia password</h2><p className="subtle">Aggiorna la password del tuo account.</p></div></div>
            <form className="stack" onSubmit={(e) => e.preventDefault()}>
              <div><label>Nuova password</label><input type="password" placeholder="Minimo 6 caratteri" /></div>
              <div><label>Conferma password</label><input type="password" placeholder="Ripeti la password" /></div>
              <button className="btn btn-primary" type="submit">Salva password</button>
            </form>
          </div>
          <div className="card stack">
            <div className="panel-head"><div><h2>Profilo</h2><p className="subtle">Account connesso.</p></div></div>
            <div className="mini-card"><div className="metric-label">Email</div><div className="metric-value" style={{ fontSize: '1.1rem' }}>{email}</div></div>
          </div>
        </div>
      )}
    </section>
  );
}
Object.assign(window, { Dati, Impostazioni });
