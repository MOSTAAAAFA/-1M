@echo off
git config http.postBuffer 524288000
:retry
git push -u origin main --force
if %9009% neq 0 (timeout /t 10 /nobreak & goto retry)
echo DONE
pause
