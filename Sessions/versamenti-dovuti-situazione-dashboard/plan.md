# Plan — Versamenti, Dovuti, Situazione PDF, Dashboard

**Session**: `Sessions/versamenti-dovuti-situazione-dashboard/`  
**Pattern**: Plan / Execute / Verify  
**Status**: **Approved** — Execute complete (2026-05-29)

---

## Topic

Versamenti per rata/mensilità (filtri anno-mese e riepilogo), Dovuti con eccedenze/debiti esercizi precedenti e suggerimenti alla creazione esercizio, export PDF Situazione (versamenti-rate per esercizio), Dashboard con elenco versamenti per contesto.

---

## Requirements summary

1. **Versamenti** — Pagamento collegato a **una rata**; filtri anno/mese sulla **data rata**; in elenco/dettaglio mostrare anche **data versamento**; riepilogo rate coperte; **layout**: form nuovo versamento in sezione fissa (non centrato/allineato alla lunghezza dello storico).
2. **Dovuti (esercizio)** — Ogni registrazione dovuto ha la propria **ripartizione rate** (mensile/bimestrale/semestrale/custom). Eccedenze/debiti da esercizi precedenti come **versamento negativo** (o positivo se debito da recuperare), non come riga dovuto separata.
3. **Situazione** — Matrice rate + PDF contestabile.
4. **Dashboard** — **Tutti** i versamenti nel contesto `periodFilter`, UI adattiva (scroll/tabella responsive, nessun cap artificiale).

---

## Decisioni operatore (rev. 2 — vincolanti)

| # | Scelta | Dettaglio |
|---|--------|-----------|
| D1 | Ripartizione **per esercizio/dovuto** | Campi `split_mode` + `split_custom` su ogni record **dovuto** (`dues`), non su `houses`. Terminologia UI: «esercizio» dove oggi si parla di quota annuale. |
| D2 | Filtri versamenti | Anno/mese sulla **data della rata** (`installment_key` → periodo slot). Colonne/dettaglio: **data rata** + **data versamento**. |
| D3 | Carry-forward / saldi | **Versamento** con importo **negativo** (eccedenza versata in più) o positivo (debito); flag/metadata `carry_from_period_id`. Suggerimento solo N → N+1. |
| D4 | Dashboard | Elenco **completo** nel filtro; `table-scroll` / griglia responsive; niente layout che «allunga» o centra la pagina in base al contenuto. |
| D5 | UI Versamenti | Layout **a due zone**: pannello form **fisso** (sticky su desktop, blocco superiore su mobile); storico in area scroll indipendente. Non usare `.forms` a 2 colonne uguali che allineano form e tabella sulla stessa altezza. |
| D6 | PDF | Client-side jsPDF + autotable (esm.sh). |
| D7 | Legacy | `installment_key` null → «da assegnare»; inferenza opzionale da data versamento con badge. |

---

## User stories (aggiornate)

| ID | Story |
|----|--------|
| US-001 | Impostare ripartizione rate **per ogni dovuto/esercizio** (mensile/bimestrale/semestrale/custom) |
| US-002 | Generare rate attese da dovuto + `fiscalStartMonth` + `split_mode` del dovuto |
| US-003 | Associare versamento a una rata; importo può essere negativo per rettifiche/carry |
| US-004 | Filtrare versamenti per anno/mese **della rata**; mostrare data versamento in dettaglio |
| US-005 | Riepilogo Versamenti (N versamenti, X/Y rate coperte, totale netto) |
| US-006 | Registrare eccedenza/debito come **versamento** con segno appropriato |
| US-007 | Suggerimento carry: propone **versamento** (±) solo da esercizio N a N+1 |
| US-008 | Export PDF Situazione per esercizio |
| US-009 | Dashboard: tutti i versamenti filtrati da `periodFilter`, layout adattivo |
| US-010 | Edit/delete versamenti e ricalcolo saldi |
| US-011 | Multi-casa + persistenza |
| US-012 | Migrazione legacy senza rata |
| **US-013** | **UI Versamenti**: form in sezione fissa, storico scrollabile separato |

---

## Acceptance criteria (rev. 2)

- **AC-US001-01**: Form dovuto include select ripartizione; salvato su `dues.split_mode`.
- **AC-US003-02**: Versamento carry-forward ha `amount < 0` per eccedenza da riportare come credito (convenzione documentata in UI).
- **AC-US004-01**: Filtro luglio 2024 mostra versamenti la cui **rata** è luglio 2024, anche se `payment.date` è agosto.
- **AC-US004-02**: Tabella/dettaglio riga mostra **entrambe** le date (rata | versamento).
- **AC-US007-01**: +3€ su 2024/2025 → creando 2025/2026 suggerisce versamento -3€ (o etichetta «Riporto eccedenza») su prima rata / esercizio nuovo.
- **AC-US007-02**: Creando 2023/2024 → **nessun** suggerimento da 2024/2025.
- **AC-US009-01**: Con `periodFilter = Tutti`, dashboard elenca **tutti** i versamenti casa (scroll interno se necessario).
- **AC-US009-03**: Su viewport stretto la sezione non deforma KPI/card adiacenti (solo scroll nel pannello versamenti).
- **AC-US013-01**: Scroll lungo storico versamenti **non** sposta il form «Nuovo versamento» fuori viewport iniziale (sticky/fixed column).
- **AC-US013-02**: Su mobile form resta nel blocco superiore prima dello scroll tabella.

---

## Architectural notes (rev. 2)

### Schema

| Tabella | Colonne |
|---------|---------|
| `dues` | `split_mode` text, `split_custom` jsonb nullable |
| `payments` | `installment_key` text nullable, `carry_from_period_id` bigint nullable → `fiscal_periods`, `is_carry_forward` boolean default false |
| `payments.amount` | Consentire **valori negativi** (migration check constraint se presente) |

**Rimosso** rispetto a rev. 1: `houses.installment_mode`, `dues.due_kind` / `carry_source` su dues.

### Carry-over (`carryover.js`)

- Calcola saldo esercizio precedente (dovuti − versamenti, inclusi negativi).
- Alla creazione esercizio contiguo: modal «Registrare versamento di riporto €X?» → crea `payment` con importo opposto al saldo, `is_carry_forward: true`, rata suggerita (es. prima del periodo).

### UI Versamenti (`index.html` + `css/app.css`)

```html
<div class="versamenti-layout">
  <aside class="versamenti-form-pane">… paymentForm …</aside>
  <section class="versamenti-list-pane">
    … filtri + riepilogo + paymentsTable …
  </section>
</div>
```

- Desktop: colonna form ~minmax(320px, 380px) sticky `top`; lista `flex:1` + `overflow:auto`.
- Mobile: colonna singola, form non in grid 50/50 con tabella.

### Dashboard

- Nuovo `#dashboardPayments` in Panoramica: stessa tabella compatta di Versamenti (colonne rata + date), `max-height` opzionale con scroll **solo nel pannello**, non sulla pagina intera.

---

## Task breakdown (rev. 2)

| ID | Title | Depends | Done when |
|----|-------|---------|-----------|
| T-001 | Migrazione: `dues.split_*`, `payments.installment_key`, `carry_*`, amount signed | — | DB ok |
| T-002 | `installments.js` — slot per **dovuto** (split da record due) | T-001 | Rate per (due, period) |
| T-003 | state/api mapping | T-001, T-002 | Persistenza |
| T-004 | Form **dovuto**: select ripartizione + custom | T-003 | US-001 |
| T-005 | Form versamento: rata + amount signed + date | T-002, T-003 | US-003, US-006 |
| T-006 | Tabella versamenti: col. rata, data rata, data versamento | T-005 | US-004 display |
| T-007 | Filtri anno/mese su **periodo rata** + riepilogo | T-006 | US-004, US-005 |
| **T-007b** | **Layout versamenti fisso** (`versamenti-layout` CSS) | — | US-013 |
| T-008 | ~~Dovuti carry rows~~ | — | **Cancellato** — sostituito da versamenti negativi |
| T-009 | `carryover.js` → suggerisce **payment** signed | T-005 | US-007 |
| T-010 | Matrice Situazione | T-002, T-009 | Griglia rate |
| T-011 | PDF export | T-010 | US-008 |
| T-012 | Dashboard tutti versamenti, scroll contenuto | T-006 | US-009 |
| T-013 | Import banca + rata da data | T-005 | |
| T-014 | Backup JSON v3 | T-003 | |
| T-015 | E2E manuale | T-004–T-014, T-007b | |

---

## Open questions

*Nessuna bloccante — rev. 2 chiude le 5 domande precedenti.*

---

## Approval

**Operator**: reply **`approve`** / **`revise: …`** / **`stop`**

No code changes until approved.
