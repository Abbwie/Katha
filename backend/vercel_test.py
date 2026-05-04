from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"ok": True, "message": "FastAPI on Vercel is working"}