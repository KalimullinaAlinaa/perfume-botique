<<<<<<< HEAD
Fixed full-stack shop project (Angular + FastAPI) - prepared Oct 2025
-----------------------------------------------------------------
Backend: FastAPI + SQLModel + SQLite (shop.db auto-created & seeded)
Frontend: Angular 20.3.x workspace (zone.js 0.15.x), Angular Material included

Backend usage (Windows, inside backend folder):
  py -3.13 -m venv venv
  .\venv\Scripts\activate
  pip install -r requirements.txt
  uvicorn app.main:app --reload

Frontend usage (inside frontend folder):
  npm install
  ng serve --host 0.0.0.0

Notes:
- This archive fixes dependency mismatches (SQLModel vs SQLAlchemy and zone.js vs Angular).
- SQLite file `shop.db` will be created in backend when server starts.
=======
# perfume-botique
>>>>>>> c011e17844c75047eec99ea6db06fcafee240d8e
