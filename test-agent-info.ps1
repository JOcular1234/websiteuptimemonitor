# Check agent info from Mastra Cloud
$url = "https://squeaking-blue-whale.mastra.cloud/api/agents/uptimeAgent"

try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    Write-Host "Agent Info:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
