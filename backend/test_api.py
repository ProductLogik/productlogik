import requests

login_data = {
    "username": "pro.test@test.com",
    "password": "password123"
}

try:
    r = requests.post("http://127.0.0.1:8000/api/auth/token", data=login_data)
    token = r.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    r2 = requests.get("http://127.0.0.1:8000/api/analysis/trends", headers=headers)
    print("API RESPONSE:")
    print(r2.json())
except Exception as e:
    print("Error:", e)
