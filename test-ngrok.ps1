$url = "https://ffc29e68d8ad.ngrok-free.app/api/a2a"

$body = @{
    jsonrpc = "2.0"
    id = "test-ngrok"
    params = @{
        message = @{
            kind = "message"
            role = "user"
            parts = @(
                @{
                    kind = "text"
                    text = "Check if google.com is up"
                }
            )
        }
    }
} | ConvertTo-Json -Depth 10

Write-Host "Testing ngrok endpoint..." -ForegroundColor Cyan
Write-Host "URL: $url" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    Write-Host "`n✅ SUCCESS!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "`n❌ FAILED!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
