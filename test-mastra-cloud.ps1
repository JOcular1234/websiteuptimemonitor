# Test Mastra Cloud Endpoint
$url = "https://squeaking-blue-whale.mastra.cloud/api/agents/uptimeAgent/generate"

$body = @{
    messages = @(
        @{
            role = "user"
            content = "Check if google.com is up"
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "Testing Mastra Cloud endpoint..." -ForegroundColor Cyan
Write-Host "URL: $url" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "✅ SUCCESS! Mastra Cloud is working!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Agent Response:" -ForegroundColor Yellow
    Write-Host $response.text -ForegroundColor White
    Write-Host ""
    Write-Host "Full Response:" -ForegroundColor Gray
    $response | ConvertTo-Json -Depth 5
    
} catch {
    Write-Host "❌ ERROR" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "This might mean:" -ForegroundColor Gray
    Write-Host "- Mastra Cloud is still deploying (wait 1-2 minutes)" -ForegroundColor Gray
    Write-Host "- Check your Mastra Cloud dashboard for deployment status" -ForegroundColor Gray
}
