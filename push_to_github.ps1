$pat = "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"
$repoName = "internship-tracker"
$username = "eduthehacker01"

# 1. Create the private repository via API
$body = @{ name = $repoName; private = $true } | ConvertTo-Json
try {
    $res = Invoke-RestMethod -Method POST -Uri "https://api.github.com/user/repos" -Headers @{ Authorization = "token $pat"; Accept = "application/vnd.github+json" } -Body $body -ErrorAction Stop
    Write-Host "Created private repository successfully on GitHub!"
} catch {
    Write-Host "Repository may already exist or creation failed: $_"
}

# 2. Git setup & commit
git init
git config user.name "eduthehacker01"
git config user.email "chinedumazubuike123@gmail.com"
git add .
git commit -m "Initial commit - SIWES Internship Portal with mobile UI, charts, PDF exporter, and email notifications"

# 3. Add remote & push
git remote remove origin 2>$null
git remote add origin "https://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@github.com/eduthehacker01/internship-tracker.git"
git branch -M main
git push -u origin main --force
