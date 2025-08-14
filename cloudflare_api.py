# cloudflare_api.py
import os
import requests
import json

# توکن و Zone ID را یا در محیط سیستم تعریف کنید یا اینجا جایگزین کنید
API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN", "YOUR_API_TOKEN")
ZONE_ID = os.getenv("CLOUDFLARE_ZONE_ID", "20af1f01ef3adc5eeca52b216056ba01")

BASE_URL = f"https://api.cloudflare.com/client/v4/zones/{ZONE_ID}"
HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def list_dns_records():
    url = f"{BASE_URL}/dns_records"
    resp = requests.get(url, headers=HEADERS)
    print(resp.json())

def create_a_record(name, ip, proxied=True):
    url = f"{BASE_URL}/dns_records"
    data = {
        "type": "A",
        "name": name,
        "content": ip,
        "ttl": 120,
        "proxied": proxied
    }
    resp = requests.post(url, headers=HEADERS, data=json.dumps(data))
    print(resp.json())

def create_redirect_rule(pattern, destination):
    """
    ساخت یک Page Rule برای ریدایرکت: مثال:
    pattern    = '*matin-mohammadi.ir/contact'
    destination = 'https://matin-mohammadi.ir/contact/'
    """
    url = f"{BASE_URL}/pagerules"
    data = {
        "targets": [
            {
                "target": "url",
                "constraint": {
                    "operator": "matches",
                    "value": pattern
                }
            }
        ],
        "actions": [
            {
                "id": "forwarding_url",
                "value": {
                    "status_code": 301,
                    "url": destination
                }
            }
        ],
        "priority": 1,
        "status": "active"
    }
    resp = requests.post(url, headers=HEADERS, data=json.dumps(data))
    print(resp.json())

if __name__ == "__main__":
    # مثال استفاده:
    # list_dns_records()
    # create_a_record("test", "1.2.3.4", proxied=False)
    # create_redirect_rule("*matin-mohammadi.ir/contact", "https://matin-mohammadi.ir/contact/")
    pass
