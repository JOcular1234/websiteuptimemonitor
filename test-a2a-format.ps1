# Test sending A2A format (what Telex sends) to Mastra Cloud
$url = "https://squeaking-blue-whale.mastra.cloud/api/agents/uptimeAgent/generate"

# A2A format (JSON-RPC 2.0) - what Telex sends
$a2aBody = @{
    jsonrpc = "2.0"
    id = "test-telex-1"
    params = @{
        messages = @(
            @{
                role = "user"
                content = "Check if google.com is up"
            }
        )
    }
} | ConvertTo-Json -Depth 10

Write-Host "Testing A2A format (what Telex sends)..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $a2aBody -ContentType "application/json"
    Write-Host "✅ Endpoint accepted A2A format!" -ForegroundColor Green
    Write-Host ""
    $response | ConvertTo-Json -Depth 3
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "❌ ERROR - Status Code: $statusCode" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "This means:" -ForegroundColor Gray
    Write-Host "- The endpoint doesn't accept A2A (JSON-RPC 2.0) format" -ForegroundColor Gray
    Write-Host "- Telex is sending A2A format but endpoint expects native Mastra format" -ForegroundColor Gray  
    Write-Host "- We need to find the correct A2A endpoint or change the node type" -ForegroundColor Gray
}
