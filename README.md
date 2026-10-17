# AccessMind AI

AccessMind AI helps people discover welfare schemes, check eligibility, save
schemes, and get guidance from an assistant. The project has a React/Vite
frontend and a FastAPI backend with a local SQLite database.

## Run on Windows

Requirements: Python 3.11 or newer and Node.js/npm.

From the project root, install dependencies once:

```powershell
py -m venv backend\venv
backend\venv\Scripts\python -m pip install -r backend\requirements.txt
npm --prefix frontend ci
```

Then double-click `Open AccessMind.bat` (or run it from the project root). It
starts the backend and frontend and opens the app at
http://localhost:5173. Keep both server windows open while using the app.

The API health endpoint is http://127.0.0.1:8000/health. The app creates its
SQLite database locally in `backend/accessmind.db`; this runtime database is
intentionally excluded from version control.

## Project layout

- `backend/` — FastAPI routes, eligibility logic, models, and seed data
- `frontend/` — React/Vite user interface and assets
- `scripts/start-all.bat` — Windows launcher used by `Open AccessMind.bat`
