@echo off

echo ==========================================
echo PROJECT ORBIT - DATABASE BACKUP
echo ==========================================

set PG_BIN=C:\Program Files\PostgreSQL\16\bin
set PG_HOST=localhost
set PG_PORT=5432
set PG_USER=postgres

echo.
echo Backing up orbit_db...
"%PG_BIN%\pg_dump.exe" ^
  -h %PG_HOST% ^
  -p %PG_PORT% ^
  -U %PG_USER% ^
  -F p ^
  --create ^
  --no-owner ^
  --no-privileges ^
  -f "01_orbit_db.sql" ^
  orbit_db

echo.
echo Backing up orbit_auth_db...
"%PG_BIN%\pg_dump.exe" ^
  -h %PG_HOST% ^
  -p %PG_PORT% ^
  -U %PG_USER% ^
  -F p ^
  --create ^
  --no-owner ^
  --no-privileges ^
  -f "02_orbit_auth_db.sql" ^
  orbit_auth_db

echo.
echo Backing up orbit_inventory_db...
"%PG_BIN%\pg_dump.exe" ^
  -h %PG_HOST% ^
  -p %PG_PORT% ^
  -U %PG_USER% ^
  -F p ^
  --create ^
  --no-owner ^
  --no-privileges ^
  -f "03_orbit_inventory_db.sql" ^
  orbit_inventory_db

echo.
echo Backing up orbit_notification_db...
"%PG_BIN%\pg_dump.exe" ^
  -h %PG_HOST% ^
  -p %PG_PORT% ^
  -U %PG_USER% ^
  -F p ^
  --create ^
  --no-owner ^
  --no-privileges ^
  -f "04_orbit_notification_db.sql" ^
  orbit_notification_db

echo.
echo Backing up orbit_order_db...
"%PG_BIN%\pg_dump.exe" ^
  -h %PG_HOST% ^
  -p %PG_PORT% ^
  -U %PG_USER% ^
  -F p ^
  --create ^
  --no-owner ^
  --no-privileges ^
  -f "05_orbit_order_db.sql" ^
  orbit_order_db

echo.
echo Backing up orbit_payment_db...
"%PG_BIN%\pg_dump.exe" ^
  -h %PG_HOST% ^
  -p %PG_PORT% ^
  -U %PG_USER% ^
  -F p ^
  --create ^
  --no-owner ^
  --no-privileges ^
  -f "06_orbit_payment_db.sql" ^
  orbit_payment_db

echo.
echo ==========================================
echo BACKUP COMPLETED
echo ==========================================

pause