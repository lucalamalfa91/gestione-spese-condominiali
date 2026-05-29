/* Movimenti view — Dovuti · Versamenti · Import banca · Situazione */
const M_TABS = [
  ['dovuti', 'Dovuti'], ['versamenti', 'Versamenti'], ['import', 'Import banca'], ['situazione', 'Situazione'],
];

function Movimenti({ house, subview, setSubview, addDue, addPayment }) {
  return (
    <section className="view active">
      <nav className="sub-nav" role="tablist" aria-label="Sezioni movimenti">
        {M_TABS.map(([id, label]) => (
          <button key={id} type="button" role="tab" className={`sub-nav-btn ${subview === id ? 'active' : ''}`}
            aria-selected={subview === id} onClick={() => setSubview(id)}>{label}</button>
        ))}
      </nav>
      {subview === 'dovuti' && <DuePanel house={house} addDue={addDue} />}
      {subview === 'versamenti' && <PaymentPanel house={house} addPayment={addPayment} />}
      {subview === 'import' && <ImportPanel />}
      {subview === 'situazione' && <SituazionePanel house={house} />}
    </section>
  );
}

function DuePanel({ house, addDue }) {
  const [label, setLabel] = React.useState(house.periods[0]?.label || '2024/2025');
  const [amount, setAmount] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!amount) return;
    addDue({ id: 'd' + Date.now(), period: label, description: desc || 'Dovuto', amount: Number(amount) });
    setAmount(''); setDesc('');
  };
  const dues = [...house.dues].reverse();
  return (
    <div className="forms">
      <div className="card stack">
        <div className="panel-head"><div><h2>Nuovo dovuto</h2><p className="subtle">Registra quote per esercizio fiscale.</p></div></div>
        <form className="stack" onSubmit={submit}>
          <div className="field-grid">
            <div><label>Esercizio fiscale</label><input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="es. 2024/2025" /><p className="hint">Formato: 2024/2025 (mese inizio {house.fiscalStartMonth})</p></div>
            <div><label>Importo dovuto</label><input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          </div>
          <div><label>Descrizione</label><input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Preventivo, saldo, conguaglio…" /></div>
          <div className="form-actions"><button className="btn btn-primary" type="submit">Salva dovuto</button></div>
        </form>
      </div>
      <div className="card">
        <div className="panel-head"><div><h2>Dovuti registrati</h2><p className="subtle">Modifica o elimina le quote per esercizio.</p></div></div>
        <div className="table-scroll">
          {dues.length ? (
            <table>
              <thead><tr><th>Esercizio</th><th>Descrizione</th><th>Importo</th><th></th></tr></thead>
              <tbody>{dues.map((d) => (
                <tr key={d.id}><td>{d.period}</td><td>{d.description || '—'}</td><td className="amount">{fmt(d.amount)}</td>
                  <td><div className="row-actions"><button className="btn btn-secondary" type="button">Modifica</button><button className="btn btn-secondary" type="button">Elimina</button></div></td></tr>
              ))}</tbody>
            </table>
          ) : <div className="empty">Nessun dovuto registrato.</div>}
        </div>
      </div>
    </div>
  );
}

function PaymentPanel({ house, addPayment }) {
  const [period, setPeriod] = React.useState(house.periods[0]?.label || '');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState('2025-05-01');
  const [method, setMethod] = React.useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!amount) return;
    addPayment({ id: 'v' + Date.now(), period, date, method: method || 'Bonifico', amount: Number(amount) });
    setAmount(''); setMethod('');
  };
  const payments = [...house.payments].reverse();
  return (
    <div className="forms">
      <div className="card stack">
        <div className="panel-head"><div><h2>Nuovo versamento</h2><p className="subtle">Registra un pagamento effettuato.</p></div></div>
        <form className="stack" onSubmit={submit}>
          <div className="field-grid">
            <div><label>Esercizio fiscale</label><select value={period} onChange={(e) => setPeriod(e.target.value)}>{house.periods.map((p) => <option key={p.id} value={p.label}>{p.label}</option>)}</select></div>
            <div><label>Importo versato</label><input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          </div>
          <div className="field-grid">
            <div><label>Data versamento</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div><label>Metodo</label><input value={method} onChange={(e) => setMethod(e.target.value)} placeholder="Bonifico, contanti…" /></div>
          </div>
          <div className="form-actions"><button className="btn btn-primary" type="submit">Salva versamento</button></div>
        </form>
      </div>
      <div className="card">
        <div className="panel-head"><div><h2>Storico versamenti</h2><p className="subtle">Elenco dei pagamenti registrati.</p></div></div>
        <div className="table-scroll">
          {payments.length ? (
            <table>
              <thead><tr><th>Esercizio</th><th>Data</th><th>Metodo</th><th>Importo</th><th></th></tr></thead>
              <tbody>{payments.map((p) => (
                <tr key={p.id}><td>{p.period}</td><td>{p.date || '—'}</td><td>{p.method || '—'}</td><td className="amount positive">{fmt(p.amount)}</td>
                  <td><div className="row-actions"><button className="btn btn-secondary" type="button">Modifica</button><button className="btn btn-secondary" type="button">Elimina</button></div></td></tr>
              ))}</tbody>
            </table>
          ) : <div className="empty">Nessun versamento registrato.</div>}
        </div>
      </div>
    </div>
  );
}

function ImportPanel() {
  return (
    <div className="forms">
      <div className="card stack">
        <div className="panel-head"><div><h2>Import Excel Banca Intesa</h2><p className="subtle">Formato export "Lista Operazioni".</p></div></div>
        <label className="btn btn-secondary" htmlFor="fakefile">Carica file Excel</label>
        <input className="file-input" id="fakefile" type="file" />
        <p className="muted">I movimenti con match incerto restano non associati fino a conferma manuale.</p>
        <button className="btn btn-primary" type="button">Conferma import selezionati</button>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Data</th><th>Descrizione</th><th>Importo</th><th>Match</th></tr></thead>
            <tbody>
              <tr><td>2025-02-03</td><td>BONIFICO QUOTA CONDOMINIO</td><td className="amount">699,50 €</td><td><Badge kind="success">2024/2025</Badge></td></tr>
              <tr><td>2025-01-18</td><td>ADDEBITO SEPA</td><td className="amount">120,00 €</td><td><Badge kind="warn">Da associare</Badge></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="card stack">
        <div className="panel-head"><div><h2>Da associare manualmente</h2><p className="subtle">Movimenti importati senza esercizio fiscale.</p></div></div>
        <div className="table-scroll"><div className="empty">Nessun movimento in coda.</div></div>
      </div>
    </div>
  );
}

function SituazionePanel({ house }) {
  return (
    <div className="card">
      <div className="panel-head"><div><h2>Situazione annualità</h2><p className="subtle">Tutti gli esercizi registrati.</p></div></div>
      <div className="annual-list">
        {house.periods.map((p) => {
          const bal = p.paid - p.due; const [k, , short] = periodStatus(bal);
          return (
            <div className="annual-item" key={p.id}>
              <div><strong>{p.label}</strong><div className="hint">Dovuto {fmt(p.due)} · Versato {fmt(p.paid)}</div></div>
              <div><Badge kind={k}>{short}</Badge></div>
              <strong className={bal >= 0 ? 'positive' : 'negative'}>{fmtSigned(bal)}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}
if (typeof window !== 'undefined') window.Movimenti = Movimenti;
