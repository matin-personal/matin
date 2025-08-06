import os
import requests
from dotenv import load_dotenv

load_dotenv(os.path.expanduser("~/.secrets/cloudflare.env"))
email = os.getenv("CLOUDFLARE_EMAIL")
api_key = os.getenv("CLOUDFLARE_API_KEY")

headers = {
    "X-Auth-Email": email,
    "X-Auth-Key": api_key,
    "Content-Type": "application/json"
}

domain = "matin-mohammadi.ir"

url = f"https://api.cloudflare.com/client/v4/zones?name={domain}"

response = requests.get(url, headers=headers)
if response.status_code == 200:
    zone = response.json()["result"][0]
    print(f"✅ Zone ID: {zone['id']}")
else:
    print("❌ خطا در دریافت Zone ID")
