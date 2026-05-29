/* Panoramica (overview) view */
function Overview({ house, goTo }) {
  const t = houseTotals(house);
  const [period, setPeriod] = React.useState('all');
  const rows = period === 'all' ? house.periods : house.periods.filter((p) => p.id === period);

  const metrics = [
    ['Totale dovuto', fmt(t.due), `${house.dues.length} registrazioni`, ''],
    ['Totale versato', fmt(t.paid), `${house.payments.length} versamenti`, ''],
    ['Saldo complessivo', fmtSigned(t.balance), t.balance >= 0 ? 'Sei in eccedenza' : 'Sei in debito', t.balance >= 0 ? 'positive' : 'negative'],
    ['Esercizi fiscali', String(t.years), `${t.debtYears} in debito · ${t.creditYears} in eccedenza`, t.debtYears ? 'warning' : 'positive'],
  ];

  return (
    <section className="view active">
      <div className="hero">
        <div>
          <h2 className="page-title">{house.name}</h2>
          <p className="muted">{house.location} · esercizio da {monthName(house.fiscalStartMonth)}</p>
        </div>
        <div className="toolbar">
          <button className="btn btn-primary" type="button" onClick={() => goTo('movimenti', 'dovuti')}>+ Dovuto</button>
          <button className="btn btn-secondary" type="button" onClick={() => goTo('movimenti', 'versamenti')}>+ Versamento</button>
        </div>
      </div>

      <section className="cards">
        {metrics.map(([label, value, foot, status]) => (
          <article className="card" key={label}>
            <div className="metric-label">{label}</div>
            <div className={`metric-value ${status}`}>{value}</div>
            <div className="metric-foot">{foot}</div>
          </article>
        ))}
      </section>

      <section className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <div><h2>Riepilogo annualità</h2><p className="subtle">Confronto per esercizio fiscale.</p></div>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} style={{ width: 'auto', minHeight: 40 }}>
              <option value="all">Tutti</option>
              {house.periods.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Esercizio</th><th>Dovuto</th><th>Versato</th><th>Saldo</th><th>Stato</th></tr></thead>
              <tbody>
                {rows.map((p) => {
                  const bal = p.paid - p.due; const [k, long] = periodStatus(bal);
                  return (
                    <tr key={p.id}>
                      <td>{p.label}<div className="hint">{p.start} → {p.end}</div></td>
                      <td className="amount">{fmt(p.due)}</td>
                      <td className="amount">{fmt(p.paid)}</td>
                      <td className={`amount ${bal >= 0 ? 'positive' : 'negative'}`}>{fmtSigned(bal)}</td>
                      <td><Badge kind={k}>{long}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><div><h2>Scadenzario sintetico</h2><p className="subtle">Saldi aperti o in eccedenza.</p></div></div>
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
      </section>
    </section>
  );
}
function monthName(m) {
  return ['', 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'][m] || 'giugno';
}
if (typeof window !== 'undefined') window.Overview = Overview;
