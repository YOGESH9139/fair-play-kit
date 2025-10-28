# 🤖 Fair Play Kit: Provably Fair Gaming Primitives for Algorand

The Fair Play Kit is a comprehensive, open-source toolkit designed to help developers quickly build transparent and trustless games on the Algorand blockchain. It provides the essential primitives for secure player matching, move submission, and verifiable game resolution.

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

3. **Frontend (`game-demo.tsx`)**: A React application demonstrating the full workflow.
   - Uses the `@txnlab/use-wallet-react` hook to handle secure transaction signing.
   - Implements polling logic to check the blockchain every few seconds for changes (e.g., detecting when an opponent has joined).

## 🚀 Quick Start (Demo Setup)

To run the demo game locally and see the entire system in action, follow these steps:

### Prerequisites

- Node.js (v18+)
- Python 3 (with PyTeal and Algorand SDK installed)
- An Algorand TestNet Wallet (e.g., Pera Wallet) with some test ALGOs.

### 1. Compile and Deploy the Smart Contract

You must deploy a fresh contract instance to get a valid App ID.

```bash
# 1. Compile the PyTeal to TEAL
python fair_play.py

# 2. Deploy the contract using your deploy script (assuming deploy.py)
python deploy.py

# **CRITICAL**: Copy the new App ID outputted by the script.
# (e.g., App ID: 1234567)
```

### 2. Configure the Frontend

Open your `game-demo.tsx` file and update the `APP_ID` constant with the value you copied in Step 1.

```typescript
// In components/game-demo.tsx
const APP_ID = 1234567; // <-- PASTE YOUR NEW APP ID HERE
```

### 3. Run the Application

```bash
npm install
npm run dev
```

Open your browser and connect two different wallets (one regular window, one incognito) to simulate two players.

## 📋 Fair Play Kit Function Checklist

This table shows the core functions defined in the SDK and the status of their implementation.

| Category | Function Name | Status | Description |
|----------|---------------|--------|-------------|
| Setup | `getGlobalState()` | ✅ Implemented | Reads the global counter to predict the next Match ID. |
| Matchmaking | `createMatch(sender, amount, nextId)` | ✅ Implemented | Creates a new game lobby with a dynamic Match ID. |
| Matchmaking | `joinMatch(sender, matchId)` | ✅ Implemented | Allows Player 2 to join the created match. |
| Gameplay | `commitMove(sender, matchId, move, salt)` | ✅ Implemented | Submits a player's hashed move to the match box. |
| Gameplay | `revealMove(sender, matchId, move, salt)` | ✅ Implemented | Reveals the move and verifies the commitment hash. |
| Resolution | `resolveMatch(sender, matchId)` | ✅ Implemented | Triggers the final logic to determine the winner and update the match state. |
| Resolution | `claimWinnings(sender, matchId, winner, amount)` | ❌ To Be Implemented | Facilitates the final transfer of funds/assets from the escrow. |
| Utility | `getMatchState(matchId)` | ✅ Implemented | Retrieves and parses the current state of a specific match box. |

---

**Built with ❤️ for the Algorand community**
