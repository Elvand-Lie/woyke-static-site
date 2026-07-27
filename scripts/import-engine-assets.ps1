param(
  [Parameter(Mandatory = $true)]
  [string]$EnginePath,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$Public = Join-Path $EnginePath 'public'
$SourceImages = Join-Path $Public 'images'
$SourceGuides = Join-Path $Public 'guides'
$TargetImages = Join-Path $Root 'images'
$TargetGuides = Join-Path $Root 'guides'

if (-not (Test-Path $SourceImages)) {
  throw "Missing engine image directory: $SourceImages"
}

New-Item -ItemType Directory -Force -Path $TargetImages | Out-Null

$copyArgs = @{
  Path = (Join-Path $SourceImages '*')
  Destination = $TargetImages
  Recurse = $true
}
if ($Force) { $copyArgs['Force'] = $true }
Copy-Item @copyArgs

if (Test-Path $SourceGuides) {
  New-Item -ItemType Directory -Force -Path $TargetGuides | Out-Null
  $guideArgs = @{
    Path = (Join-Path $SourceGuides '*')
    Destination = $TargetGuides
    Recurse = $true
  }
  if ($Force) { $guideArgs['Force'] = $true }
  Copy-Item @guideArgs
}

Write-Host "Imported engine assets." -ForegroundColor Green
Write-Host "Images: $TargetImages"
Write-Host "Guides: $TargetGuides"
Write-Host "Preserved source spelling/case, including Angklet when present."
