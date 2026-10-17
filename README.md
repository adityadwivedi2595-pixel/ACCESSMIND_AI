# AccessMind AI

[Open the live website](https://adityadwivedi2595-pixel.github.io/ACCESSMIND_AI/)

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

## Publish the website

The frontend is deployed to GitHub Pages by `.github/workflows/deploy.yml`.
In the repository settings, open **Pages** and set **Build and deployment >
Source** to **GitHub Actions**. The site is published at
https://adityadwivedi2595-pixel.github.io/ACCESSMIND_AI/.

The live frontend uses the FastAPI backend hosted separately on Render. To
create it, sign in to Render, create a **Blueprint** from this repository, and
deploy `render.yaml`. The frontend deployment expects the Render service URL
`https://accessmind-ai-api.onrender.com`; if Render assigns a different URL,
update `VITE_API_BASE_URL` in the Pages workflow and push again. The Render
free service can sleep when idle, so its first request may take a little longer.
Its SQLite database is temporary on the free plan; profile and saved-scheme
data may be lost when the service restarts. Use persistent database hosting
before relying on this app to keep personal data.

Each browser gets a private random session ID for its profile and saved
schemes. Keep browser storage private and do not share its session token.

## Project layout

- `backend/` — FastAPI routes, eligibility logic, models, and seed data
- `frontend/` — React/Vite user interface and assets
- `scripts/start-all.bat` — Windows launcher used by `Open AccessMind.bat`
