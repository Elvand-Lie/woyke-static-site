Set-Location $PSScriptRoot
Start-Process 'http://127.0.0.1:4187'
node .\serve.mjs
