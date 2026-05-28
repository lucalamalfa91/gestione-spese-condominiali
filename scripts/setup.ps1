#Requires -Version 7
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Info    { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "[OK]   $msg" -ForegroundColor Green }
function Write-Warn    { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err     { param($msg) Write-Host "[ERR]  $msg" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Setup — Gestione Spese Condominiali            ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── prerequisiti ─────────────────────────────────────────────────────────────
Write-Info "Verifica prerequisiti..."

$missing = @()
foreach ($cmd in @('gh', 'vercel', 'supabase', 'jq')) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) { $missing += $cmd }
}
if ($missing.Count -gt 0) {
    Write-Err "Strumenti mancanti: $($missing -join ', ')`n  - gh:       https://cli.github.com`n  - vercel:   npm i -g vercel`n  - supabase: https://supabase.com/docs/guides/cli`n  - jq:       winget install stedolan.jq"
}
Write-Success "Tutti i prerequisiti presenti"
Write-Host ""

# ── Vercel ───────────────────────────────────────────────────────────────────
Write-Info "Step 1/4 — Collegamento progetto Vercel"
Write-Host "  Verrà aperta la procedura interattiva di 'vercel link'."
Write-Host "  Se non hai ancora un progetto su Vercel, scegli 'Create new project'."
Write-Host ""
vercel link

$projectJsonPath = ".vercel\project.json"
if (-not (Test-Path $projectJsonPath)) {
    Write-Err ".vercel\project.json non trovato dopo vercel link"
}
$projectJson   = Get-Content $projectJsonPath -Raw | ConvertFrom-Json
$VercelOrgId   = $projectJson.orgId
$VercelProjectId = $projectJson.projectId
Write-Success "Vercel collegato  →  orgId=$VercelOrgId  projectId=$VercelProjectId"
Write-Host ""

# ── Vercel token ─────────────────────────────────────────────────────────────
Write-Info "Step 2/4 — Token Vercel"
Write-Host "  Crea un token su https://vercel.com/account/tokens"
$VercelTokenSS = Read-Host "  Incolla il VERCEL_TOKEN" -AsSecureString
$VercelToken   = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($VercelTokenSS)
)
if ([string]::IsNullOrWhiteSpace($VercelToken)) { Write-Err "Token vuoto" }
Write-Success "Token acquisito"
Write-Host ""

# ── Supabase ──────────────────────────────────────────────────────────────────
Write-Info "Step 3/4 — Collegamento progetto Supabase"
Write-Host "  Crea un access token su https://supabase.com/dashboard/account/tokens"
$SupabaseTokenSS = Read-Host "  Incolla il SUPABASE_ACCESS_TOKEN" -AsSecureString
$SupabaseToken   = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SupabaseTokenSS)
)
if ([string]::IsNullOrWhiteSpace($SupabaseToken)) { Write-Err "Token vuoto" }

Write-Host ""
Write-Host "  Trova il Reference ID in:"
Write-Host "  Supabase Dashboard → Project Settings → General → Reference ID"
$SupabaseProjectRef = (Read-Host "  Incolla il SUPABASE_PROJECT_REF (12 caratteri)").Trim()
if ([string]::IsNullOrWhiteSpace($SupabaseProjectRef)) { Write-Err "Project ref vuoto" }

Write-Info "Collegamento al progetto Supabase..."
$env:SUPABASE_ACCESS_TOKEN = $SupabaseToken
supabase link --project-ref $SupabaseProjectRef
Write-Success "Supabase collegato"
Write-Host ""

Write-Info "Applicazione migrations al database..."
supabase db push
Write-Success "Migrations applicate"
Remove-Item Env:\SUPABASE_ACCESS_TOKEN -ErrorAction SilentlyContinue
Write-Host ""

# ── GitHub secrets ────────────────────────────────────────────────────────────
Write-Info "Step 4/4 — Impostazione secrets GitHub"
Write-Host ""

$repo = (gh repo view --json nameWithOwner -q '.nameWithOwner' 2>$null).Trim()
if ([string]::IsNullOrWhiteSpace($repo)) {
    Write-Err "Impossibile determinare il repo GitHub. Esegui 'gh auth login' e riprova."
}
Write-Info "Repo rilevato: $repo"
Write-Host ""

function Set-GhSecret {
    param([string]$Name, [string]$Value)
    Write-Host -NoNewline "  Imposto $Name... "
    $Value | gh secret set $Name --repo $repo
    Write-Host "[OK]" -ForegroundColor Green
}

Set-GhSecret "VERCEL_TOKEN"          $VercelToken
Set-GhSecret "VERCEL_ORG_ID"         $VercelOrgId
Set-GhSecret "VERCEL_PROJECT_ID"     $VercelProjectId
Set-GhSecret "SUPABASE_ACCESS_TOKEN" $SupabaseToken
Set-GhSecret "SUPABASE_PROJECT_REF"  $SupabaseProjectRef

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   Setup completato                               ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Success "5 secrets impostati su GitHub"
Write-Host ""
Write-Host "  Prossimo passo: esegui un push su main per avviare il pipeline:"
Write-Host ""
Write-Host "    git add . && git commit -m 'chore: add CI/CD pipeline' && git push origin main"
Write-Host ""
