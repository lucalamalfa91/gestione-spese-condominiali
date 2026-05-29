/* Sample data + formatting helpers (it-IT EUR) */
const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
const fmt = (v) => eur.format(Number(v || 0));
const fmtSigned = (v) => (v > 0 ? '+' : '') + eur.format(Number(v || 0));

const SAMPLE_HOUSES = [
  {
    id: 'h1', name: 'Appartamento Milano', location: 'Milano', fiscalStartMonth: 6,
    periods: [
      { id: 'p1', label: '2024/2025', start: '2024-06-01', end: '2025-05-31', due: 1240, paid: 1499.5 },
      { id: 'p2', label: '2023/2024', start: '2023-06-01', end: '2024-05-31', due: 1180, paid: 980 },
      { id: 'p3', label: '2022/2023', start: '2022-06-01', end: '2023-05-31', due: 1100, paid: 1100 },
    ],
    dues: [
      { id: 'd1', period: '2024/2025', description: 'Preventivo ordinario', amount: 980 },
      { id: 'd2', period: '2024/2025', description: 'Conguaglio riscaldamento', amount: 260 },
      { id: 'd3', period: '2023/2024', description: 'Preventivo ordinario', amount: 1180 },
    ],
    payments: [
      { id: 'v1', period: '2024/2025', date: '2024-09-12', method: 'Bonifico', amount: 800 },
      { id: 'v2', period: '2024/2025', date: '2025-02-03', method: 'Bonifico', amount: 699.5 },
      { id: 'v3', period: '2023/2024', date: '2024-01-20', method: 'Contanti', amount: 980 },
    ],
  },
  {
    id: 'h2', name: 'Casa al mare — Liguria', location: 'Sanremo', fiscalStartMonth: 1,
    periods: [
      { id: 'p4', label: '2025', start: '2025-01-01', end: '2025-12-31', due: 640, paid: 320 },
      { id: 'p5', label: '2024', start: '2024-01-01', end: '2024-12-31', due: 600, paid: 600 },
    ],
    dues: [
      { id: 'd4', period: '2025', description: 'Preventivo ordinario', amount: 640 },
      { id: 'd5', period: '2024', description: 'Preventivo ordinario', amount: 600 },
    ],
    payments: [
      { id: 'v4', period: '2025', date: '2025-03-15', method: 'Bonifico', amount: 320 },
      { id: 'v5', period: '2024', date: '2024-04-10', method: 'Bonifico', amount: 600 },
    ],
  },
];

function houseTotals(h) {
  const due = h.periods.reduce((s, p) => s + p.due, 0);
  const paid = h.periods.reduce((s, p) => s + p.paid, 0);
  return { due, paid, balance: paid - due, years: h.periods.length,
    debtYears: h.periods.filter((p) => p.paid - p.due < 0).length,
    creditYears: h.periods.filter((p) => p.paid - p.due > 0).length };
}

function Badge({ kind, children }) {
  const cls = { success: 'success', error: 'error', warn: 'warn' }[kind] || 'warn';
  return <span className={`badge ${cls}`}>{children}</span>;
}

function periodStatus(balance) {
  if (balance > 0) return ['success', 'In eccedenza', 'Eccedenza'];
  if (balance < 0) return ['error', 'In debito', 'Debito'];
  return ['warn', 'Pareggio', 'Pareggio'];
}

Object.assign(window, { fmt, fmtSigned, SAMPLE_HOUSES, houseTotals, Badge, periodStatus });
