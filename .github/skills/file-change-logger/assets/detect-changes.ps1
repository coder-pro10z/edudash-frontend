# File Change Detection Script
# Detects modified files in the workspace and reports line count changes

param(
    [string]$ChangelogPath = "CHANGELOG.log"
)

function Get-LineCount {
    param([string]$FilePath)
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -ErrorAction SilentlyContinue
        if ($null -eq $content) { return 0 }
        if ($content -is [array]) { return $content.Count }
        return 1
    }
    return 0
}

function Get-LastLogTime {
    param([string]$ChangelogPath)
    if (-not (Test-Path $ChangelogPath)) {
        return [datetime]::MinValue
    }
    $lastLine = Get-Content $ChangelogPath -Tail 1
    if ($lastLine -match '\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]') {
        return [datetime]::ParseExact($Matches[1], 'yyyy-MM-dd HH:mm:ss', $null)
    }
    return [datetime]::MinValue
}

# Get workspace root
$workspaceRoot = Get-Location
$lastLogTime = Get-LastLogTime -ChangelogPath $ChangelogPath
$modifiedFiles = @()

Write-Host "🔍 Scanning for modified files since last log entry..." -ForegroundColor Cyan
Write-Host "Last log time: $(if ($lastLogTime -eq [datetime]::MinValue) { 'Never' } else { $lastLogTime })" -ForegroundColor Gray
Write-Host ""

# Scan src directory for modified files
if (Test-Path "src") {
    Get-ChildItem -Path "src" -Recurse -File | ForEach-Object {
        if ($_.LastWriteTime -gt $lastLogTime) {
            $lineCountNow = Get-LineCount -FilePath $_.FullName
            $relativePath = $_.FullName -replace [regex]::Escape($workspaceRoot), "" -replace "^\\", ""
            
            $modifiedFiles += [PSCustomObject]@{
                Path = $relativePath
                LastModified = $_.LastWriteTime
                LineCount = $lineCountNow
            }
        }
    }
}

if ($modifiedFiles.Count -eq 0) {
    Write-Host "✅ No modified files found since last log." -ForegroundColor Green
    exit 0
}

Write-Host "📝 Modified Files (since last log):" -ForegroundColor Yellow
Write-Host ""
$modifiedFiles | Sort-Object LastModified | ForEach-Object {
    $icon = if ($_.LineCount -gt 100) { "📄" } else { "🔧" }
    Write-Host "$icon  $($_.Path)" -ForegroundColor White
    Write-Host "   └─ Modified: $(${_.LastModified}.ToString('yyyy-MM-dd HH:mm:ss')) | $($_.LineCount) lines" -ForegroundColor Gray
}

Write-Host ""
Write-Host "💡 Tip: Use 'log-changes.ps1 -Files @(...) -Summary ""..."""' to log these changes" -ForegroundColor Cyan
Write-Host ""

# Return modified files as JSON for scripting
$modifiedFiles | ConvertTo-Json | Out-Null
exit 0
