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

zone_id = "🔴اینجا Zone ID که قبلاً گرفتی رو بذار"

records = [
    {"type": "MX", "name": "@", "content": "mx.zoho.com", "priority": 10},
    {"type": "MX", "name": "@", "content": "mx2.zoho.com", "priority": 20},
    {"type": "MX", "name": "@", "content": "mx3.zoho.com", "priority": 50},
    {"type": "TXT", "name": "@", "content": "v=spf1 include:zoho.com ~all"},
    # {"type": "CNAME", "name": "zb********", "content": "zmverify.zoho.com"} ← بعداً اضافه کن
]

for record in records:
    data = {
        "type": record["type"],
        "name": record["name"],
        "content": record["content"],
        "ttl": 3600,
        "proxied": False
    }
    if record["type"] == "MX":
        data["priority"] = record["priority"]

    response = requests.post(
        f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records",
        headers=headers,
        json=data
    )

    if response.status_code == 200 or response.status_code == 201:
        print(f"✅ رکورد {record['type']} برای {record['content']} اضافه شد.")
    else:
        print(f"❌ خطا در افزودن رکورد {record['type']}:\n{response.text}")
