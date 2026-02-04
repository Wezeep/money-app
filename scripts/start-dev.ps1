<#
PowerShell convenience script to start backend and mobile for local development on Windows.
- Opens two new PowerShell windows: one runs the backend (Maven wrapper), the other runs Expo.

Usage: Right-click and Run with PowerShell, or from PowerShell: .\scripts\start-dev.ps1
#>

# Ensure script runs from repository root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Backend window
$backendCmd = "cd .\backend; .\\mvnw spring-boot:run"
Start-Process -FilePath pwsh -ArgumentList "-NoExit", "-Command`," $backendCmd `" -WindowStyle Normal

# Mobile window
$mobileCmd = "cd .\mobile; npx expo start"
Start-Process -FilePath pwsh -ArgumentList "-NoExit", "-Command`," $mobileCmd `" -WindowStyle Normal

Write-Host "Started backend and mobile in separate PowerShell windows. Keep this window open for monitoring." -ForegroundColor Green
