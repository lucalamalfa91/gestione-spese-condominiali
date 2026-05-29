---
pattern: plan-execute-verify
protocol: deliberative-voting
topic: "Versamenti per rata/mensilità (filtri anno-mese e riepilogo), Dovuti con eccedenze/debiti esercizi precedenti e suggerimenti alla creazione esercizio, export PDF Situazione (versamenti-rate per esercizio), Dashboard con elenco versamenti per contesto."
max_rounds: 4
output_style: standard
devils_advocate: true
setup_date: 2026-05-29
agents:
  - slug: requirements-planner
    role: Requirements Planner
    skill_path: .claude/skills/council-requirements-planner/SKILL.md
    archetype: product-analyst
  - slug: task-architect
    role: Task Architect
    skill_path: .claude/skills/council-task-architect/SKILL.md
    archetype: architect
  - slug: fullstack-implementer
    role: Full-Stack Implementer
    skill_path: .claude/skills/council-fullstack-implementer/SKILL.md
    archetype: custom
  - slug: quality-verifier
    role: Quality Verifier
    skill_path: .claude/skills/council-quality-verifier/SKILL.md
    archetype: qa-strategist
---

# Council configuration

## Scenario

Migliorare le sezioni Versamenti, Dovuti, Situazione e Dashboard dell'app Gestione Spese Condominiali:

- **Versamenti**: associare ogni spesa alla singola mensilità/rata dovuta (in base a ripartizione mensile, bimestrale, semestrale, custom), non solo all'annualità; filtri per anno e mese; riepilogo con numero di rate/spese versate.
- **Dovuti**: gestione manuale di eccedenze/debiti da esercizi precedenti, con suggerimenti intelligenti (es. eccedenza +3€ su 2024/2025 proposta solo alla creazione di 2025/2026, non per esercizi anteriori).
- **Situazione**: export PDF con accoppiamento versamenti–rate per esercizio, totali dovuti/versati, eccedenze/debiti (documentazione per contestazioni verso l'amministratore).
- **Dashboard**: sezione con tutti i versamenti (legati alla rata dell'esercizio) filtrati per contesto dashboard.

## Pattern: Plan / Execute / Verify

| Phase | Owner primario | Artifact |
|-------|----------------|----------|
| **Plan** | Requirements Planner + Task Architect | `Sessions/<slug>/plan.md` (approvazione umana obbligatoria prima di Execute) |
| **Execute** | Full-Stack Implementer | Codice + `Sessions/<slug>/execution.md` |
| **Verify** | Quality Verifier | `Sessions/<slug>/verification.md` |
| **Final** | Coordinator | `Sessions/<slug>/decision.md` (template plan-and-verification) |
| **Devil's Advocate** | devils-advocate (post-deliberation) | `devils-advocate-review.md` + eventuale `decision-after-devils-review.md` |

## Protocol

`deliberative-voting` — voti: PROPOSE | OBJECT | APPROVE | ABSTAIN | REJECT.

## Output template

`plan-and-verification` (standard narrative).

## Session slug convention

Kebab-case, max ~48 caratteri: `versamenti-dovuti-situazione-dashboard`.

## HITL

- **Plan approval** (Type C): approve / revise / stop prima di qualsiasi modifica al codice.
- **Devil's Advocate**: checkpoint inline yes/skip prima della review (default: yes).

## Launch

Invoca `council-launch` con cartella sessione `Sessions/versamenti-dovuti-situazione-dashboard/`.
