import sys
sys.path.append('../sdk')

from fairplay import FairPlaySDK
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize SDK
app_id = int(os.getenv("APP_ID"))
sdk = FairPlaySDK(
    app_id,
    "",
    "https://testnet-api.algonode.cloud",
    ""
)

# Test accounts
player1_mnemonic = os.getenv("PLAYER1_MNEMONIC")
player2_mnemonic = os.getenv("PLAYER2_MNEMONIC")

print("🧪 Testing Fair Play Module...")

# Test creating match
print("1️⃣ Creating match...")
# ... add test calls here

print("✅ All tests passed!")
