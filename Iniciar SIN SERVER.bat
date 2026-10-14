@echo off

set "BACKENDPATH=%CD%\misbo\backend"
set "FRONTENDPATH=%CD%\misbo\frontend"

wt.exe -w 0 new-tab --title "Backend" cmd /k "cd /d %BACKENDPATH% && pnpm run start" ^; ^
            new-tab --title "Frontend" cmd /k "cd /d %FRONTENDPATH% && pnpm run dev"