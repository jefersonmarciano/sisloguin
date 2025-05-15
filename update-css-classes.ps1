# PowerShell script to update CSS classes from temu to sisloguin

Write-Host "Starting to update CSS classes from 'temu-' to 'sisloguin-'"

# Get all .tsx, .ts, .jsx, .js, and .css files, excluding node_modules
$files = Get-ChildItem -Path . -Recurse -File | 
    Where-Object { 
        $_.Extension -match "\.tsx|\.ts|\.jsx|\.js|\.css" -and 
        $_.FullName -notmatch "node_modules" -and
        $_.FullName -notmatch "dist" -and
        $_.FullName -notmatch "\.git"
    }

$updatedFiles = 0

foreach ($file in $files) {
    # Read file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if file contains any temu- class references
    if ($content -match "temu-") {
        # Create backup
        $backupPath = "$($file.FullName).bak"
        Copy-Item -Path $file.FullName -Destination $backupPath
        
        # Replace classes
        $newContent = $content -replace "temu-button", "sisloguin-button"
        $newContent = $newContent -replace "temu-card", "sisloguin-card"
        $newContent = $newContent -replace "temu-progress-bar", "sisloguin-progress-bar"
        $newContent = $newContent -replace "temu-progress-fill", "sisloguin-progress-fill"
        $newContent = $newContent -replace "text-temu-([a-zA-Z0-9]+)", "text-sisloguin-`$1"
        $newContent = $newContent -replace "bg-temu-([a-zA-Z0-9]+)", "bg-sisloguin-`$1"
        $newContent = $newContent -replace "border-temu-([a-zA-Z0-9]+)", "border-sisloguin-`$1"
        $newContent = $newContent -replace "from-temu-([a-zA-Z0-9]+)", "from-sisloguin-`$1"
        $newContent = $newContent -replace "to-temu-([a-zA-Z0-9]+)", "to-sisloguin-`$1"
        $newContent = $newContent -replace "focus:ring-temu-([a-zA-Z0-9]+)", "focus:ring-sisloguin-`$1"
        $newContent = $newContent -replace "hover:bg-temu-([a-zA-Z0-9]+)", "hover:bg-sisloguin-`$1"
        $newContent = $newContent -replace "hover:text-temu-([a-zA-Z0-9]+)", "hover:text-sisloguin-`$1"
        $newContent = $newContent -replace "hover:border-temu-([a-zA-Z0-9]+)", "hover:border-sisloguin-`$1"
        
        if ($content -ne $newContent) {
            # Save changes
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "Updated: $($file.FullName)"
            $updatedFiles++
        } else {
            # Remove backup if no changes were made
            Remove-Item -Path $backupPath
        }
    }
}

Write-Host "CSS class update complete. Updated $updatedFiles files." 