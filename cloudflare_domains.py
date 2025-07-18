import os
import requests
from dotenv import load_dotenv

# بارگذاری اطلاعات از فایل محیطی
load_dotenv(os.path.expanduser("~/.secrets/cloudflare.env"))
email = os.getenv("CLOUDFLARE_EMAIL")
api_key = os.getenv("CLOUDFLARE_API_KEY")

headers = {
    "X-Auth-Email": email,
    "X-Auth-Key": api_key,
    "Content-Type": "application/json"
}

response = requests.get("https://api.cloudflare.com/client/v4/zones", headers=headers)

if response.status_code == 200:
    zones = response.json()["result"]
    if not zones:
        print("❌ هیچ دامنه‌ای پیدا نشد.")
    else:
        print("✅ دامنه‌های متصل به حساب کلودفلر:")
        for z in zones:
            print(f"➤ {z['name']} (ID: {z['id']})")
else:
    print("❌ خطا در ارتباط با Cloudflare:")
    print(response.text)
