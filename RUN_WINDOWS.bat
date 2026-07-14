@echo off
cd /d "%~dp0"
start "WOYKE Prototype" http://127.0.0.1:4187
node serve.mjs
pause
