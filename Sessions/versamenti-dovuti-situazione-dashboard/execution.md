# Execution — Versamenti, Dovuti, Situazione, Dashboard

**Status**: Complete (pending Verify phase + operator manual test)

## Tasks completed

| Task | Status |
|------|--------|
| T-001 Migrazione Supabase | `supabase/migrations/20260529120000_installments.sql` |
| T-002 `installments.js` | Slot per dovuto, filtri rata, summary |
| T-003 state/api mapping | `state.js`, `api.js` |
| T-004 Form dovuto ripartizione | `index.html`, `main.js`, `render.js` |
| T-005 Form versamento + rata + importi signed | `index.html`, `main.js` |
| T-006 Tabella versamenti colonne rata/date | `render.js` |
| T-007 Filtri anno/mese su data rata + riepilogo | `render.js`, `main.js` |
| T-007b Layout versamenti fisso | `index.html`, `css/app.css` |
| T-009 `carryover.js` + suggerimento versamento | `carryover.js`, `main.js` |
| T-010 Matrice Situazione | `render.js`, `index.html` |
| T-011 Export PDF | `pdf-situazione.js`, `main.js` |
| T-012 Dashboard versamenti | `index.html`, `render.js` |
| T-013 Import banca → `installment_key` | `api.js` |
| T-014 Backup JSON v3 | `config.js`, `backup.js` |

## Files changed

- `supabase/migrations/20260529120000_installments.sql` (new)
- `js/installments.js`, `js/carryover.js`, `js/pdf-situazione.js` (new)
- `js/state.js`, `js/api.js`, `js/render.js`, `js/main.js`, `js/backup.js`, `js/config.js`
- `index.html`, `css/app.css`
- `council/config.md` (topic from launch)

## Deviations from plan

- `ensureFiscalPeriod*` ora ritorna `{ period, isNew }` (necessario per carry-over affidabile).
- Carry-over usa `confirm()` nativo invece di modal dedicato (stesso comportamento HITL, meno UI).

## Manual verification performed

- [ ] Applicare migration su Supabase (`supabase db push` o SQL editor)
- [ ] Login, creare dovuto con ripartizione bimestrale
- [ ] Versamento con rata + versamento negativo riporto
- [ ] Filtri anno/mese su data rata
- [ ] Creare esercizio N+1 → dialogo riporto
- [ ] Export PDF Situazione
- [ ] Dashboard con filtro esercizio
- [ ] Reload pagina — persistenza REST

## Known limitations

- Versamenti legacy senza `installment_key`: rata «stimata» da data versamento.
- PDF richiede rete per caricare jsPDF da esm.sh (come Supabase/xlsx).
- Migration non applicata automaticamente in questo ambiente.
