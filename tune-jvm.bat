@echo off
rem Автонастройка JVM под твой ПК. Закрой лаунчер и запусти двойным кликом.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tune-jvm.ps1" %*
pause
