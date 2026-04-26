---
name: file-change-logger
description: "Use when: tracking code modifications, documenting changes after editing files, maintaining a changelog of all modifications with timestamps and line counts. Logs file changes to a persistent changelog with precise timestamps and line count deltas."
---

# File Change Logger Skill

## Purpose
Track all file modifications with timestamps and line count changes. Every file edit is recorded in a centralized changelog with:
- **File path** (workspace-relative)
- **Timestamp** (ISO 8601 format)
- **Lines changed** (added/removed/modified count)
- **Summary** (optional brief description)

## When to Use
- After editing one or more files and need to track what changed
- Documenting features, bug fixes, or refactoring sessions
- Maintaining an audit trail of all modifications
- Preparing for code reviews or retrospectives

## Workflow

### Step 1: Identify Modified Files
Run the change detection script to find all modified files since the last log entry:

```powershell
.\\.github\skills\file-change-logger\assets\detect-changes.ps1
```

**What it does:**
- Scans the `src/` directory for modified files
- Compares file modification time against the latest changelog entry
- Returns list of files with their line counts (before/after)

### Step 2: Review Detected Changes
The script outputs:
```
📝 Modified Files (since last log):
  - src/app/features/dashboard/dashboard.component.ts (142 → 156 lines) [+14 lines]
  - src/app/core/services/api.service.ts (87 → 85 lines) [-2 lines]
  - src/styles.scss (245 → 267 lines) [+22 lines]
```

Review the list and identify any files you want to log.

### Step 3: Log Changes
Run the logging script with the files to record:

```powershell
.\\.github\skills\file-change-logger\assets\log-changes.ps1 -Files @(
    "src/app/features/dashboard/dashboard.component.ts",
    "src/app/core/services/api.service.ts"
) -Summary "Refactored dashboard state management"
```

**Parameters:**
- `-Files` (required): Array of file paths (workspace-relative)
- `-Summary` (optional): Brief description of what changed

### Step 4: Verify Log Entry
The script appends to `CHANGELOG.log` with entry like:

```
[2026-04-26 14:32:15] dashboard.component.ts | +14 lines | Refactored dashboard state management
[2026-04-26 14:32:15] api.service.ts | -2 lines | Refactored dashboard state management
```

View the changelog anytime:
```
Get-Content CHANGELOG.log -Tail 50
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Find what changed | `.\\.github\skills\file-change-logger\assets\detect-changes.ps1` |
| Log specific files | `.\\.github\skills\file-change-logger\assets\log-changes.ps1 -Files @(...) -Summary "..."` |
| View changelog | `Get-Content CHANGELOG.log -Tail 50` |
| Clear old logs | `Remove-Item CHANGELOG.log` |

---

## Log Format

Each entry in `CHANGELOG.log` follows this format:

```
[TIMESTAMP] FILENAME | LINES_DELTA | SUMMARY
```

**Example:**
```
[2026-04-26 14:32:15] src/app/features/dashboard/dashboard.component.ts | +14 lines | Refactored dashboard state management
[2026-04-26 14:32:16] src/app/core/services/api.service.ts | -2 lines | Refactored dashboard state management
[2026-04-26 14:45:22] src/app/shared/components/stat-card/stat-card.component.scss | +8 lines | Updated card styling
```

---

## Integration Tips

### Invoke After Every Code Edit Session
Add this as a reminder at the end of your coding task:
> "Run the change logger to record today's modifications"

### Batch Log Related Changes
If you edited multiple files for one feature, include them all in one `-Files` array with a single `-Summary`.

### Archive Old Logs
Periodically move old entries:
```powershell
$date = Get-Date -Format "yyyy-MM-dd"
Copy-Item CHANGELOG.log "CHANGELOG_backup_$date.log"
```

### Git Pre-commit Hook (Optional)
For automatic logging before commits, extend `.git/hooks/pre-commit` to invoke the logger.

---

## Asset Scripts

### `detect-changes.ps1`
Finds all modified files in the workspace and reports their line count changes.

### `log-changes.ps1`
Appends timestamped entries to `CHANGELOG.log` for specified files.

---

## Example Workflow in Chat

**User prompt:**
> "I just updated the dashboard component, refactored the API service, and tweaked some styles. Log these changes."

**Agent response:**
```
1. Run change detection to identify modified files
2. Confirm the list with you
3. Log each file with timestamp and line delta
4. Show you the updated CHANGELOG.log
```

---

## Best Practices

✅ **DO:**
- Log changes immediately after editing
- Use descriptive summaries (e.g., "Fixed null pointer in data loader")
- Include related files in one entry if they're part of the same feature
- Check the log before starting a new feature

❌ **DON'T:**
- Log unrelated changes in one summary
- Use vague descriptions ("fixed stuff")
- Forget to log significant changes
- Manually edit CHANGELOG.log (always use the script)

---

## Troubleshooting

**"Script cannot be loaded"**
- Ensure PowerShell execution policy allows running scripts: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

**"CHANGELOG.log keeps growing"**
- This is intentional — it's a complete audit trail
- Archive periodically using the backup pattern above
- You can `grep` or search for specific dates/files

**"File path not found"**
- Use workspace-relative paths (e.g., `src/app/features/...`)
- Check that the file actually exists in the workspace

