# collect-logs.ps1 — собирает логи сборки в один zip на рабочем столе.
# Если игра крашнулась или глючит — запусти collect-logs.bat и скинь zip владельцу сборки.

$ErrorActionPreference = 'SilentlyContinue'
$root = $PSScriptRoot

$items = @()
foreach ($p in @('logs\latest.log', 'logs\debug.log')) {
    $full = Join-Path $root $p
    if (Test-Path $full) { $items += $full }
}
# три последних крашрепорта
$crashes = Get-ChildItem (Join-Path $root 'crash-reports\*.txt') |
    Sort-Object LastWriteTime -Descending | Select-Object -First 3
if ($crashes) { $items += $crashes.FullName }

if (-not $items) {
    Write-Host 'Логов не найдено. Игра хоть раз запускалась?' -ForegroundColor Yellow
    exit 1
}

$out = Join-Path ([Environment]::GetFolderPath('Desktop')) ("aoc-logs-" + (Get-Date -Format 'yyyy-MM-dd_HH-mm') + ".zip")
Compress-Archive -Path $items -DestinationPath $out -Force

Write-Host ''
Write-Host "Готово: $out" -ForegroundColor Green
Write-Host 'Скинь этот файл владельцу сборки.'
