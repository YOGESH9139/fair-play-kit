# 🤖 Fair Play Kit: Provably Fair Gaming Primitives for Algorand
The *Fair Play Kit* Fair Play Kit eliminates trust requirements in online gaming by making all outcomes transparent and verifiable on-chain. Developers can integrate provably fair mechanics into any Algorand game using our TypeScript/Python SDKs.

## 🌟 Features & Why Use It
- **Trustless by Design**: Eliminates the need for centralized trust. All game logic, state management, and resolution are handled by smart contracts.
- **Dynamic Matchmaking**: Implements a lobby-style system where players can create a match and share a unique ID for an opponent to join.
- **Commit-Reveal Fairness**: Utilizes the Commit-Reveal scheme to ensure both players hide their moves until both are committed, preventing cheating or information leakage.
- **Algorand Boxes for State**: Uses Algorand's Box storage to manage individual match state efficiently, supporting multiple concurrent games.

## 🏗️ How It's Built
The project is structured into three main components that communicate securely:

1. **Smart Contract (`fair_play.py`)**: The immutable backend logic, written in PyTeal.
   - Manages the global `match_counter` to generate dynamic match IDs.
   - Creates and updates individual match state within dedicated Algorand Boxes (192 Bytes).
   - Enforces the game rules, verifies committed moves, and handles match resolution.

2. **SDK (`fairplay.js`)**: The core communication layer, written in pure JavaScript/TypeScript.
   - Handles transaction construction, including predicting the `nextMatchId` and generating dynamic Box References for every transaction.
   - Provides simple, chain-agnostic function calls (e.g., `createMatch`, `joinMatch`).

3. **Frontend (`game-demo.tsx`)**: This is just a React application demonstrating the full workflow.
   - Uses the `@txnlab/use-wallet-react` hook to handle secure transaction signing.
   - Implements polling logic to check the blockchain every few seconds for changes (e.g., detecting when an opponent has joined).

## 🚀 Quick Start (Integrating the Kit) 

(This is for integrating kit only because a fully deployed vercel is ready for running the website)

To integrate the Fair Play Kit into your own Algorand dApp, follow these steps:

### Prerequisites

- Node.js (v18+) for JavaScript/TypeScript SDK
- Python 3 (with PyTeal and Algorand SDK installed) for smart contract development/deployment
- An Algorand TestNet Wallet (e.g., Pera Wallet) with some test ALGOs for testing.

### 1. Deploy the Smart Contract

First, you need to compile and deploy the `fair_play.py` smart contract to the Algorand TestNet. This will give you the App ID required by the SDK.

```bash
# 1. Compile the PyTeal to TEAL
python fair_play.py

# 2. Deploy the contract using your deployment script (e.g., deploy.py)
#    Make sure your deploy.py script outputs the App ID.
python deploy.py

# **IMPORTANT**: Copy the new App ID outputted by your deployment script.
#                This APP_ID is crucial for initializing the SDK.
#                (Example: App ID: 1234567)
```

### 2. Get the Fair Play Kit SDK

#### Clone from GitHub (For direct integration/development)

```bash
git clone https://github.com/YOGESH9139/fair-play-kit/fair-play-module
# Then, you would copy the 'fair-play-module' folder into your project.
```


### 3. Use the SDK in Your Application

Now you can import the FairPlaySDK and start interacting with your deployed smart contract.

```javascript
// If you cloned from GitHub and copied the folder (e.g., into a 'src/modules' directory)
import FairPlaySDK from './src/modules/fair-play-module/sdk'; 

// If you installed via npm
// import FairPlaySDK from 'fair-play-sdk';

// Replace with your actual deployed App ID
const APP_ID = 1234567; 
const ALGOD_TOKEN = ""; // Your Algorand API token (e.g., "a".repeat(64) for AlgoNode)
const ALGOD_SERVER = "https://testnet-api.algonode.cloud"; // Your Algorand API server
const ALGOD_PORT = ""; // Port, often empty for HTTPS

const sdk = new FairPlaySDK(APP_ID, ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

// Example: Creating a new match
async function createNewGame(senderAddress, betAmount) {
  try {
    // Crucial: Predict the next Match ID by reading the global counter
    const globalState = await sdk.getGlobalState();
    const currentMatchCounter = globalState.get("match_counter") || 0;
    const nextMatchId = currentMatchCounter + 1;

    console.log(`Preparing to create Match ID: ${nextMatchId}`);

    const unsignedTxns = await sdk.createMatch(
      senderAddress,
      betAmount,
      nextMatchId
    );

    // You would then use a wallet (e.g., Pera Wallet, AlgoSigner)
    // to sign and send these transactions.
    // Example (using a generic sign/send function from a wallet hook):
    // const signedTxns = await wallet.signTransactions(unsignedTxns);
    // const txId = await algodClient.sendRawTransaction(signedTxns).do();
    // await algosdk.waitForConfirmation(algodClient, txId, 4);

    console.log(`Match ${nextMatchId} creation transaction prepared.`);
    return nextMatchId;
  } catch (error) {
    console.error("Failed to create match:", error);
    throw error;
  }
}

// Call this function with a connected wallet's address and desired bet
// createNewGame("YOUR_CONNECTED_WALLET_ADDRESS", 100000); // Example: 100000 microAlgos
```

### *Flow:* User Action → React Component → SDK → Sign → Submit → Update UI

### Deployed Links
**Frontend Link**: https://fair-play-kit.vercel.app/

## 📋 Fair Play Kit Function Checklist

This table shows the core functions defined in the SDK and the status of their implementation.

| Category | Function Name | Status | Description |
|----------|---------------|--------|-------------|
| Setup | `getGlobalState()` | ✅ Implemented | Reads the global counter to predict the next Match ID. |
| Matchmaking | `createMatch(sender, amount, nextId)` | ✅ Implemented | Creates a new game lobby with a dynamic Match ID. |
| Matchmaking | `joinMatch(sender, matchId)` | ✅ Implemented | Allows Player 2 to join the created match. |
| Matchmaking | `createLobby()` | ❌ To Be Implemented | Creates a customizable lobby for multiple players. |
| Matchmaking | `joinLobby()` | ❌ To Be Implemented | Allows a player to join an existing lobby. |
| Matchmaking | `listOpenGames()` | ❌ To Be Implemented | Lists all available open games for players to join. |
| Gameplay | `commitMove(sender, matchId, move, salt)` | ✅ Implemented | Submits a player's hashed move to the match box. |
| Gameplay | `revealMove(sender, matchId, move, salt)` | ✅ Implemented | Reveals the move and verifies the commitment hash. |
| Gameplay | `forceReveal()` | ❌ To Be Implemented | Forces a player to reveal their move after timeout. |
| Gameplay | `challengeMove()` | ❌ To Be Implemented | Allows challenging an opponent's move validity. |
| Resolution | `resolveMatch(sender, matchId)` | ✅ Implemented | Triggers the final logic to determine the winner and update the match state. |
| Resolution | `claimWinnings(sender, matchId, winner, amount)` | ❌ To Be Implemented | Facilitates the final transfer of funds/assets from the escrow. |
| Resolution | `resolveDispute()` | ❌ To Be Implemented | Resolves disputes between players in a match. |
| Resolution | `claimReward()` | ❌ To Be Implemented | Allows winners to claim their rewards. |
| Escrow | `startEscrow()` | ❌ To Be Implemented | Initiates an escrow for match funds. |
| Escrow | `withdrawEscrow()` | ❌ To Be Implemented | Withdraws funds from escrow under valid conditions. |
| Security | `reportCheating()` | ❌ To Be Implemented | Reports suspected cheating behavior in a match. |
| Security | `auditGameResult()` | ❌ To Be Implemented | Audits game results for fairness verification. |
| Player Data | `getPlayerHistory()` | ❌ To Be Implemented | Retrieves the match history for a specific player. |
| Player Data | `getLeaderboard()` | ❌ To Be Implemented | Fetches the global leaderboard rankings. |
| Player Data | `friendList()` | ❌ To Be Implemented | Manages a player's friend list. |
| Social | `sendRematchInvite()` | ❌ To Be Implemented | Sends a rematch invitation to an opponent. |
| Social | `spectateGame()` | ❌ To Be Implemented | Allows spectators to watch ongoing games. |
| Assets | `buyInGameAsset()` | ❌ To Be Implemented | Enables in-game asset purchases. |
| Assets | `mintAchievementNFT()` | ❌ To Be Implemented | Mints NFTs for player achievements. |
| Tournament | `registerTournament()` | ❌ To Be Implemented | Registers a player for a tournament. |
| Utility | `getMatchState(matchId)` | ✅ Implemented | Retrieves and parses the current state of a specific match box. |
| Utility | `autoFundTestnet()` | ❌ To Be Implemented | Automatically funds TestNet accounts for testing. |
| Utility | `integrateThirdPartyWallets()` | ❌ To Be Implemented | Integrates third-party wallet connections. |
| Admin | `registerGameLogic()` | ❌ To Be Implemented | Registers custom game logic for new game types. |
| Admin | `upgradeContract()` | ❌ To Be Implemented | Upgrades the smart contract to a new version. |

---
**Built with ❤️ for the Algorand community**
