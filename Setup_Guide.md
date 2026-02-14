# ProductLogik - Project Setup Guide

Follow these steps to initialize the project structure manually.
**Run all commands in your terminal** at: `d:\SpicedProjects\Projects\productlogik`

---

## Part 1: Backend Setup (FastAPI)

1.  **Create the Backend Directory**
    ```bash
    mkdir backend
    cd backend
    ```

2.  **Create a Virtual Environment**
    ```bash
    python -m venv venv
    ```

3.  **Activate the Virtual Environment**
    *   **Windows (PowerShell)**: `.\venv\Scripts\Activate`
    *   *Check*: You should see `(venv)` in your terminal prompt.

4.  **Install Dependencies**
    First, create a `requirements.txt` file inside `backend/` with this content:
    ```text
    fastapi
    uvicorn
    sqlalchemy
    pydantic
    pandas
    openai
    python-multipart
    python-dotenv
    ```
    Then run:
    ```bash
    pip install -r requirements.txt
    ```

5.  **Create the Main App File**
    Create `main.py` inside `backend/` with this starter code:
    ```python
    from fastapi import FastAPI

    app = FastAPI(title="ProductLogik API")

    @app.get("/")
    def read_root():
        return {"status": "ProductLogik API is running"}
    ```

6.  **Test the Backend**
    Run: `uvicorn main:app --reload`
    *   Visit `http://127.0.0.1:8000` in your browser. You should see the JSON status.
    *   *Press Ctrl+C to stop.*

---

## Part 2: Frontend Setup (React + Vite)

1.  **Go back to Project Root**
    ```bash
    cd ..
    ```
    *(Ensure you are in `productlogik`)*

2.  **Initialize Vite Project**
    ```bash
    npm create vite@latest frontend -- --template react-ts
    ```

3.  **Install TailwindCSS**
    ```bash
    cd frontend
    npm install
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
    *   *Note*: If `npx` asks to install, say yes.

4.  **Configure Tailwind**
    Open `frontend/tailwind.config.js` and replace `content: []` with:
    ```javascript
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    ```

5.  **Add Tailwind Directives**
    Open `frontend/src/index.css` and **replace everything** with:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

6.  **Install UI Libraries (Optional but recommended for Shadcn look)**
    ```bash
    npm install lucide-react clsx tailwind-merge
    ```

7.  **Test the Frontend**
    Run: `npm run dev`
    *   Visit the URL shown (usually `http://localhost:5173`).

---

## Part 3: Folder Verification
Your structure should now look like this:
```
productlogik/
├── backend/
│   ├── venv/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── logo.png
├── Product_Master_Spec.md
└── ... (other docs)
```

**Once you have reached this state, let me know!**
We will then proceed to copying the `ui_concept` code into the real `frontend` folder and fixing those responsive issues.
