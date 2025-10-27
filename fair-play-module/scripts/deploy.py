from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk.transaction import ApplicationCreateTxn, OnComplete, StateSchema
from algosdk.logic import get_application_address
import base64
from dotenv import load_dotenv
import os
import time

load_dotenv()

# Connect to Algorand node
algod_token = os.getenv("ALGOD_TOKEN", "a" * 64)
algod_address = os.getenv("ALGOD_ADDRESS", "https://testnet-api.algonode.cloud")
algod_client = algod.AlgodClient(algod_token, algod_address)

# Your account (from mnemonic)
deployer_mnemonic = os.getenv("DEPLOYER_MNEMONIC")
deployer_private_key = mnemonic.to_private_key(deployer_mnemonic)
deployer_address = account.address_from_private_key(deployer_private_key)

print(f"🚀 Deploying from: {deployer_address}")

# Read compiled contract
with open("../contracts/fair_play_approval.teal", "r") as f:
    approval_program_teal = f.read()

with open("../contracts/fair_play_clear.teal", "r") as f:
    clear_program_teal = f.read()

# Compile programs
approval_result = algod_client.compile(approval_program_teal)
approval_program = base64.b64decode(approval_result["result"])

clear_result = algod_client.compile(clear_program_teal)
clear_program = base64.b64decode(clear_result["result"])

# Define schema
global_schema = StateSchema(num_uints=1, num_byte_slices=0)  # match_counter
local_schema = StateSchema(num_uints=0, num_byte_slices=0)  # Using boxes instead

# Create transaction
params = algod_client.suggested_params()
txn = ApplicationCreateTxn(
    sender=deployer_address,
    sp=params,
    on_complete=OnComplete.NoOpOC,
    approval_program=approval_program,
    clear_program=clear_program,
    global_schema=global_schema,
    local_schema=local_schema,
    extra_pages=1  # For boxes
)

# Sign and send
signed_txn = txn.sign(deployer_private_key)
tx_id = algod_client.send_transaction(signed_txn)

print(f"📤 Transaction sent: {tx_id}")
print("⏳ Waiting for confirmation...")

# Wait for confirmation
def wait_for_confirmation(client, txid, timeout=10):
    start_time = time.time()
    while True:
        try:
            pending_txn = client.pending_transaction_info(txid)
            if pending_txn.get("confirmed-round", 0) > 0:
                return pending_txn
            elif time.time() - start_time > timeout:
                raise Exception("Timeout waiting for confirmation")
            else:
                time.sleep(1)
        except Exception as e:
            time.sleep(1)

confirmed = wait_for_confirmation(algod_client, tx_id)
app_id = confirmed.get("application-index")
if not app_id:
    raise Exception(f"App ID not found in confirmation: {confirmed}")

print(f"✅ App deployed successfully!")
print(f"📋 App ID: {app_id}")
print(f"🏠 App Address: {get_application_address(app_id)}")

# Save app ID to .env
with open("../.env", "a") as f:
    f.write(f"\nAPP_ID={app_id}")
