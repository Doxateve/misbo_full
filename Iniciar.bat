@echo off

set SERVERPATH=C:\Users\sgome\OneDrive\Desktop\proyectoBN\server-test-mc
set BACKENDPATH=C:\Users\sgome\OneDrive\Desktop\proyectoBN\misbo\backend
set FRONTENDPATH=C:\Users\sgome\OneDrive\Desktop\proyectoBN\misbo\frontend

wt.exe -w 0 new-tab --title "MC Server" cmd /k "cd /d %SERVERPATH% && java -Xmx4G -Xms1G -jar server.jar"

timeout /t 10 >Nul

wt.exe -w 0 new-tab --title "Backend" cmd /k "cd /d %BACKENDPATH% && pnpm run start" ^; ^
            new-tab --title "Frontend" cmd /k "cd /d %FRONTENDPATH% && pnpm run dev"