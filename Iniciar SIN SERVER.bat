@echo off

set BACKENDPATH=C:\Users\Samuel\Desktop\misbo_full\misbo\backend
set FRONTENDPATH=C:\Users\Samuel\Desktop\misbo_full\misbo\frontend

wt.exe -w 0 new-tab --title "Backend" cmd /k "cd /d %BACKENDPATH% && pnpm run start" ^; ^
            new-tab --title "Frontend" cmd /k "cd /d %FRONTENDPATH% && pnpm run dev"