# File Change Logger Script
# Logs file changes with timestamps and line count deltas to CHANGELOG.log

param(
    [Parameter(Mandatory=$true)]
    [string[]]$Files,
    
    [string]$Summary = "",
    
    [string]$ChangelogPath = "CHANGELOG.log",
    
    [switch]$ShowEntry
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

function Format-LinesDelta {
    param([int]$Delta)
    if ($Delta -gt 0) {
        return "+$Delta"
    } elseif ($Delta -lt 0) {
        return "$Delta"
    } else {
        return "0"
    }
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$entriesAdded = 0

Write-Host "📋 Logging $($Files.Count) file(s)..." -ForegroundColor Cyan
Write-Host "Timestamp: $timestamp" -ForegroundColor Gray
Write-Host ""

foreach ($file in $Files) {
    # Normalize path
    $filePath = $file -replace "\\", "/"
    
    if (-not (Test-Path $filePath)) {
        Write-Host "⚠️  File not found: $filePath" -ForegroundColor Yellow
        continue
    }
    
    $lineCount = Get-LineCount -FilePath $filePath
    $linesDelta = Format-LinesDelta -Delta $lineCount
    
    # Extract filename for display
    $fileName = Split-Path -Leaf $filePath
    
    # Build log entry
    $logEntry = "[$timestamp] $filePath | $linesDelta lines"
    if ($Summary) {
        $logEntry += " | $Summary"
    }
    
    # Append to changelog
    Add-Content -Path $ChangelogPath -Value $logEntry -Encoding UTF8
    
    $entriesAdded++
    
    # Display to console
    $deltaColor = if ($linesDelta.StartsWith("+")) { "Green" } elseif ($linesDelta.StartsWith("-")) { "Red" } else { "Gray" }
    Write-Host "✓ $fileName" -ForegroundColor White -NoNewline
    Write-Host " | $linesDelta lines" -ForegroundColor $deltaColor -NoNewline
    if ($Summary) {
        Write-Host " | $Summary" -ForegroundColor Gray
    } else {
        Write-Host ""
    }
}

Write-Host ""
Write-Host "✅ Logged $entriesAdded entry(ies) to $ChangelogPath" -ForegroundColor Green

if ($ShowEntry) {
    Write-Host ""
    Write-Host "📖 Latest changelog entries:" -ForegroundColor Cyan
    Write-Host ""
    Get-Content $ChangelogPath -Tail 5 | ForEach-Object {
        Write-Host $_ -ForegroundColor Gray
    }
}

exit 0
