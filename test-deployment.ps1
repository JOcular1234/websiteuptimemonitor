# Test your deployed Uptime Monitor Agent
# Replace YOUR_RAILWAY_URL with your actual Railway URL

$RAILWAY_URL = "https://websiteuptimemonitor-production.up.railway.app/api/agents/uptimeAgent/generate"

Write-Host "Testing deployed agent at: $RAILWAY_URL" -ForegroundColor Cyan
Write-Host ""

$body = @{
    messages = @(
        @{
            role = "user"
            content = "Check if google.com is up"
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$RAILWAY_URL" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "✅ SUCCESS! Agent is working!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Response Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update telex-workflow.json with: $RAILWAY_URL"
Write-Host "2. Import workflow to Telex.im"
Write-Host "3. Test in Telex chat!"


# $url = "https://websiteuptimemonitor-production.up.railway.app/api/a2a"
# $body = '{"jsonrpc":"2.0","id":"test-1","params":{"messages":[{"role":"user","content":"Check if google.com is up"}]}}'

# Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 10