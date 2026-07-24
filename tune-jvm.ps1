# tune-jvm.ps1 — автонастройка JVM для сборки «All of Create - Aeronautics» от mwxkhmy
# Prism / PolyMC / MultiMC: пишет instance.cfg сам (запускать при ЗАКРЫТОМ лаунчере)
# Modrinth / CurseForge: печатает готовые аргументы и куда их вставить
# Скрипт лежит в папке .minecraft инстанса, instance.cfg — на уровень выше.
#
# Параметры:
#   -DryRun     показать решение, ничего не записывать
#   -HeapMB N   вручную задать кучу в МБ (иначе по объёму ОЗУ)
#   -ZGC        Generational ZGC вместо G1 (плавнее кадры, ест больше CPU; только если ОЗУ >= 24 ГБ)

param(
    [switch]$DryRun,
    [int]$HeapMB = 0,
    [switch]$ZGC
)

$ErrorActionPreference = 'Stop'

$cfg = Join-Path (Split-Path -Parent $PSScriptRoot) 'instance.cfg'
if (-not (Test-Path $cfg)) {
    $roots = @("$env:APPDATA\PrismLauncher\instances", "$env:APPDATA\PolyMC\instances", "$env:APPDATA\MultiMC\instances")
    $candidates = Get-ChildItem ($roots | ForEach-Object { "$_\*\instance.cfg" }) -ErrorAction SilentlyContinue |
        Where-Object { Select-String -Path $_.FullName -Pattern 'ManagedPackID=1518930' -Quiet }
    if ($candidates) { $cfg = $candidates[0].FullName }
}
$manualMode = -not (Test-Path $cfg)

if (-not $manualMode) {
    $running = Get-Process -Name 'prismlauncher', 'polymc', 'MultiMC' -ErrorAction SilentlyContinue
    if ($running -and -not $DryRun) {
        Write-Host "ЗАКРОЙ лаунчер ($(($running | Select-Object -ExpandProperty ProcessName) -join ', ')) и запусти скрипт снова" -ForegroundColor Yellow
        exit 1
    }
}

$cs  = Get-CimInstance Win32_ComputerSystem
$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
$ramGB   = [math]::Round($cs.TotalPhysicalMemory / 1GB, 1)
$threads = $cs.NumberOfLogicalProcessors

if ($HeapMB -gt 0) {
    $heap = $HeapMB
} elseif ($ramGB -ge 30)  { $heap = 10240 }
  elseif ($ramGB -ge 22)  { $heap = 9216 }
  elseif ($ramGB -ge 14)  { $heap = 8192 }
  elseif ($ramGB -ge 11)  { $heap = 6656 }
  elseif ($ramGB -ge 7.5) { $heap = 5120 }
  else                    { $heap = 4608 }

$warn = @()
if ($ramGB -lt 12) { $warn += "ОЗУ всего $ramGB ГБ — для 204 модов впритык. Закрывай браузер и лишние приложения перед игрой." }
if ($ZGC -and $ramGB -lt 24) { $warn += 'ZGC отключён: нужно >= 24 ГБ ОЗУ. Использовано G1.'; $ZGC = $false }

# ── флаги GC ──
if ($ZGC) {
    $gcFlags = @(
        '-XX:+UnlockExperimentalVMOptions', '-XX:+UseZGC', '-XX:+ZGenerational',
        '-XX:+AlwaysPreTouch', '-XX:+DisableExplicitGC', '-XX:+PerfDisableSharedMem',
        '-XX:+UseStringDeduplication'
    )
    $gcName = 'Generational ZGC'
} else {
    $gcFlags = @(
        '-XX:+UnlockExperimentalVMOptions', '-XX:+UnlockDiagnosticVMOptions',
        '-XX:+UseG1GC', '-XX:MaxGCPauseMillis=37',
        '-XX:+AlwaysPreTouch', '-XX:+DisableExplicitGC', '-XX:+ParallelRefProcEnabled',
        '-XX:G1HeapRegionSize=16M', '-XX:G1NewSizePercent=23', '-XX:G1ReservePercent=20',
        '-XX:SurvivorRatio=32', '-XX:MaxTenuringThreshold=1',
        '-XX:G1MixedGCCountTarget=3', '-XX:G1HeapWastePercent=20',
        '-XX:InitiatingHeapOccupancyPercent=10', '-XX:G1RSetUpdatingPauseTimePercent=0',
        '-XX:G1SATBBufferEnqueueingThresholdPercent=30', '-XX:G1ConcMarkStepDurationMillis=5.0',
        '-XX:G1ConcRSHotCardLimit=16', '-XX:G1ConcRefinementServiceIntervalMillis=150',
        '-XX:+PerfDisableSharedMem', '-XX:+UseStringDeduplication'
    )
    $gcName = 'G1 (клиентский тюнинг)'
}
$jvmArgs = ($gcFlags -join ' ')

$javaOk = $true
if (-not $manualMode) {
    $lines = Get-Content $cfg
    $autoJava = ($lines | Where-Object { $_ -match '^AutomaticJava=true' }) -ne $null
    $javaOk = $autoJava
    if (-not $autoJava) {
        $jp = ($lines | Where-Object { $_ -match '^JavaPath=' }) -replace '^JavaPath=', ''
        if ($jp) {
            $javaExe = $jp -replace 'javaw\.exe$', 'java.exe'
            try {
                $v = (& $javaExe -version 2>&1 | Select-Object -First 1) -join ''
                if ($v -match '"(2[1-9]|[3-9]\d)') { $javaOk = $true }
            } catch {}
        }
    }
}

Write-Host ''
Write-Host "Процессор : $($cpu.Name.Trim()) ($threads потоков)"
Write-Host "ОЗУ       : $ramGB ГБ"
Write-Host "Куча      : $heap МБ (Xms = Xmx)"
Write-Host "GC        : $gcName"
if ($javaOk) { Write-Host 'Java      : 21+ (ок)' } else { Write-Host 'Java      : НЕ 21! Включи в лаунчере авто-Java или укажи Java 21' -ForegroundColor Red }
foreach ($w in $warn) { Write-Host "ВНИМАНИЕ  : $w" -ForegroundColor Yellow }

if ($manualMode) {
    Write-Host ''
    Write-Host 'Лаунчер Prism/PolyMC/MultiMC не найден — вставь настройки вручную:' -ForegroundColor Cyan
    Write-Host ''
    Write-Host "Память (min и max): $heap МБ"
    Write-Host 'Аргументы JVM (одной строкой):'
    Write-Host ''
    Write-Host $jvmArgs -ForegroundColor White
    Write-Host ''
    Write-Host 'Куда вставить:'
    Write-Host '  Modrinth App : ⋮ на инстансе -> Edit -> Java arguments (память — ползунок Memory allocated)'
    Write-Host '  CurseForge   : шестерёнка на профиле -> Game Specific -> Minecraft -> Additional Arguments'
    Write-Host '                 (память — ползунок Allocated Memory; сними галку Use System Memory Settings)'
    Write-Host '  Java при этом должна быть 21 (в обоих лаунчерах ставится сама).'
    exit 0
}

Write-Host "Файл      : $cfg"
if ($DryRun) { Write-Host ''; Write-Host '(пробный запуск, ничего не записано)' -ForegroundColor Cyan; exit 0 }

# ── запись instance.cfg ──
$set = [ordered]@{
    'OverrideMemory'   = 'true'
    'MinMemAlloc'      = "$heap"
    'MaxMemAlloc'      = "$heap"
    'OverrideJavaArgs' = 'true'
    'JvmArgs'          = $jvmArgs
}
$out = New-Object System.Collections.Generic.List[string]
$done = @{}
foreach ($line in $lines) {
    $handled = $false
    foreach ($k in $set.Keys) {
        if ($line -match "^$k=") { $out.Add("$k=$($set[$k])"); $done[$k] = $true; $handled = $true; break }
    }
    if (-not $handled) { $out.Add($line) }
}
foreach ($k in $set.Keys) {
    if (-not $done[$k]) {
        $i = $out.IndexOf('[General]')
        $out.Insert($i + 1, "$k=$($set[$k])")
    }
}
Copy-Item $cfg "$cfg.bak" -Force
[System.IO.File]::WriteAllLines($cfg, $out, [System.Text.UTF8Encoding]::new($false))
Write-Host ''
Write-Host 'Готово! Настройки записаны (бэкап: instance.cfg.bak). Запускай лаунчер.' -ForegroundColor Green
