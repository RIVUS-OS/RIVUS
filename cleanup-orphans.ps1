# RIVUS v1.2.15 — Cleanup orphaned placeholder pages
# These pages have NO P19 hooks, NO sidebar links, and are old CORE D.O.O. placeholders
# that have been replaced by enforced pages under /dashboard/core-company/*

$orphans = @(
    "app\dashboard\core\accountants"
    "app\dashboard\core\accounting"
    "app\dashboard\core\accounting-control"
    "app\dashboard\core\analitika"
    "app\dashboard\core\bankovni-racuni"
    "app\dashboard\core\bilanca"
    "app\dashboard\core\blagajna"
    "app\dashboard\core\bruto"
    "app\dashboard\core\cjenik"
    "app\dashboard\core\core-dashboard"
    "app\dashboard\core\core-dokumenti"
    "app\dashboard\core\core-postavke"
    "app\dashboard\core\core-ugovori"
    "app\dashboard\core\devizni"
    "app\dashboard\core\dobit"
    "app\dashboard\core\dospjeli"
    "app\dashboard\core\eracuni"
    "app\dashboard\core\izvoz"
    "app\dashboard\core\knjigovodstvo"
    "app\dashboard\core\nenaplaceno"
    "app\dashboard\core\neto"
    "app\dashboard\core\orkestracija"
    "app\dashboard\core\pdv"
    "app\dashboard\core\platform-fees"
    "app\dashboard\core\porezne-stope"
    "app\dashboard\core\predujmovi"
    "app\dashboard\core\prihodi"
    "app\dashboard\core\primljeni-racuni"
    "app\dashboard\core\projekcija"
    "app\dashboard\core\rashodi"
    "app\dashboard\core\izdani-racuni"
    "app\dashboard\core\service-dashboard"
    "app\dashboard\core\spv-billing"
    "app\dashboard\core\spv-pipeline"
    "app\dashboard\core\staranje"
    "app\dashboard\core\storna"
    "app\dashboard\core\tok\eskalacije"
    "app\dashboard\core\tok\sla"
    "app\dashboard\core\vertikale-billing"
)

$deleted = 0
$skipped = 0

foreach ($dir in $orphans) {
    if (Test-Path $dir) {
        Remove-Item -Recurse -Force $dir
        Write-Host "  DELETED: $dir" -ForegroundColor Yellow
        $deleted++
    } else {
        Write-Host "  SKIP: $dir (not found)" -ForegroundColor Gray
        $skipped++
    }
}

Write-Host ""
Write-Host "Done: $deleted deleted, $skipped skipped" -ForegroundColor Green
