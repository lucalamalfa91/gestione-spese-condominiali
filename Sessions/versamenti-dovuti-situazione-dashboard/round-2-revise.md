# Round 2 — Operator revise (2026-05-29)

## Operator input

1. Ripartizione **per dovuto/esercizio**, non per casa.
2. Filtro su **data rata**; in dettaglio anche **data versamento**.
3. Carry-forward come **versamento negativo** (più gestibile).
4. Dashboard: **tutti** i versamenti, UI adattiva senza deformare layout.
5. Versamenti: form **fisso** nella sua sezione, non centrato rispetto alla lunghezza dello storico.

## Coordinator synthesis

**Consensus (plan)**: PROPOSE — piano aggiornato in `plan.md` rev. 2.

**Changes from rev. 1**
- D1: `dues.split_mode` / `split_custom` (not `houses`)
- D3: carry via `payments` negative amount + flags
- D2: filter by installment period
- D4/D5: dashboard full list + `versamenti-layout` sticky form
- T-008 cancelled; T-007b added; US-013 added

**Next**: HITL approve → Execute phase.
