#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()    { echo -e "${CYAN}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
die()     { echo -e "${RED}[ERR]${NC}  $*" >&2; exit 1; }

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   Setup — Gestione Spese Condominiali            ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# ── prerequisiti ─────────────────────────────────────────────────────────────
info "Verifica prerequisiti..."
command -v gh      >/dev/null 2>&1 || die "GitHub CLI (gh) non trovato. Installa da https://cli.github.com"
command -v vercel  >/dev/null 2>&1 || die "Vercel CLI non trovato. Esegui: npm i -g vercel"
command -v supabase >/dev/null 2>&1 || die "Supabase CLI non trovato. Vedi https://supabase.com/docs/guides/cli"
command -v jq      >/dev/null 2>&1 || die "jq non trovato. Installa con: apt install jq / brew install jq"
success "Tutti i prerequisiti presenti"
echo ""

# ── Vercel ───────────────────────────────────────────────────────────────────
info "Step 1/4 — Collegamento progetto Vercel"
echo "  Verrà aperta la procedura interattiva di 'vercel link'."
echo "  Se non hai ancora un progetto su Vercel, scegli 'Create new project'."
echo ""
vercel link

if [[ ! -f ".vercel/project.json" ]]; then
  die ".vercel/project.json non trovato dopo vercel link"
fi

VERCEL_ORG_ID=$(jq -r '.orgId'     .vercel/project.json)
VERCEL_PROJECT_ID=$(jq -r '.projectId' .vercel/project.json)
success "Vercel collegato  →  orgId=$VERCEL_ORG_ID  projectId=$VERCEL_PROJECT_ID"
echo ""

# ── Vercel token ─────────────────────────────────────────────────────────────
info "Step 2/4 — Token Vercel"
echo "  Crea un token su https://vercel.com/account/tokens"
echo -n "  Incolla il VERCEL_TOKEN: "
read -rs VERCEL_TOKEN
echo ""
[[ -z "$VERCEL_TOKEN" ]] && die "Token vuoto"
success "Token acquisito"
echo ""

# ── Supabase ──────────────────────────────────────────────────────────────────
info "Step 3/4 — Collegamento progetto Supabase"
echo "  Crea un access token su https://supabase.com/dashboard/account/tokens"
echo -n "  Incolla il SUPABASE_ACCESS_TOKEN: "
read -rs SUPABASE_ACCESS_TOKEN
echo ""
[[ -z "$SUPABASE_ACCESS_TOKEN" ]] && die "Token vuoto"

echo ""
echo "  Trova il Reference ID in:"
echo "  Supabase Dashboard → Project Settings → General → Reference ID"
echo -n "  Incolla il SUPABASE_PROJECT_REF (12 caratteri): "
read -r SUPABASE_PROJECT_REF
[[ -z "$SUPABASE_PROJECT_REF" ]] && die "Project ref vuoto"

info "Collegamento al progetto Supabase..."
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" supabase link --project-ref "$SUPABASE_PROJECT_REF"
success "Supabase collegato"
echo ""

info "Applicazione migrations al database..."
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" supabase db push
success "Migrations applicate"
echo ""

# ── GitHub secrets ────────────────────────────────────────────────────────────
info "Step 4/4 — Impostazione secrets GitHub"
echo ""

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
if [[ -z "$REPO" ]]; then
  die "Impossibile determinare il repo GitHub. Esegui 'gh auth login' e riprova."
fi
info "Repo rilevato: $REPO"
echo ""

set_secret() {
  local name="$1" value="$2"
  echo -n "  Imposto $name... "
  echo "$value" | gh secret set "$name" --repo "$REPO"
  echo -e "${GREEN}✓${NC}"
}

set_secret "VERCEL_TOKEN"          "$VERCEL_TOKEN"
set_secret "VERCEL_ORG_ID"         "$VERCEL_ORG_ID"
set_secret "VERCEL_PROJECT_ID"     "$VERCEL_PROJECT_ID"
set_secret "SUPABASE_ACCESS_TOKEN" "$SUPABASE_ACCESS_TOKEN"
set_secret "SUPABASE_PROJECT_REF"  "$SUPABASE_PROJECT_REF"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   Setup completato                               ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
success "5 secrets impostati su GitHub"
echo ""
echo "  Prossimo passo: esegui un push su main per avviare il pipeline:"
echo ""
echo "    git add . && git commit -m 'chore: add CI/CD pipeline' && git push origin main"
echo ""
