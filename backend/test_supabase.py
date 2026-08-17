"""
Test script to verify Supabase connection and tables for Dr. Farmer
Run with: python test_supabase.py
"""

import os
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env.local"))
load_dotenv(os.path.join(BASE_DIR, ".env"))

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

def test_connection():
    print("=" * 60)
    print("[DR. FARMER] - SUPABASE CONNECTION TEST")
    print("=" * 60)

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("[!] Result: NOT CONNECTED")
        print("[X] Reason: SUPABASE_URL or SUPABASE_KEY is missing from .env")
        print("\n--> To fix this, create a file named '.env' in:")
        print(f"    {os.path.join(BASE_DIR, '.env')}")
        print("\n    with the following content:")
        print("    SUPABASE_URL=https://your-project-id.supabase.co")
        print("    SUPABASE_KEY=your-supabase-anon-key")
        print("=" * 60)
        return

    masked_key = SUPABASE_KEY[:6] + "..." + SUPABASE_KEY[-4:] if len(SUPABASE_KEY) > 10 else "***"
    print(f"[*] Connecting to URL: {SUPABASE_URL}")
    print(f"[*] Using Key: {masked_key}")

    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("[OK] Supabase client initialized successfully!")
    except Exception as e:
        print(f"[FAIL] Could not initialize Supabase client: {e}")
        return

    # Check tables
    tables = ["disease_catalog", "crop_cycles", "livestock_profiles", "diagnostic_logs"]
    print("\n[*] Checking database tables...")
    for table in tables:
        try:
            res = supabase.table(table).select("*").limit(5).execute()
            count = len(res.data) if res.data else 0
            print(f"  [OK] Table '{table}': reachable ({count} sample rows returned)")
        except Exception as e:
            print(f"  [FAIL] Table '{table}': {e}")

    print("\n" + "=" * 60)
    print("[DR. FARMER] Verification complete.")
    print("=" * 60)

if __name__ == "__main__":
    test_connection()
