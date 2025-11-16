# Fair Play Kit 🎮

> Provably Fair Gaming Primitives for Algorand

Fair Play Kit is a developer SDK that brings cryptographically secure gaming to Algorand. Build games where every outcome is transparent, verifiable, and tamper-proof on-chain.

**Built for AlgoBharat Hackseries 2025**

---

## 📄 Project Overview

Fair Play Kit eliminates trust requirements in online gaming by making random outcomes, matchmaking, and payouts transparent and verifiable on-chain. Developers can integrate provably fair mechanics into any Algorand game using our TypeScript/Python SDKs.

**What it does:**
- Creates trustless gaming experiences on Algorand
- Implements commit-reveal protocol to prevent cheating
- Manages match lobbies and player pairing
- Handles secure escrow and automated payouts
- Provides easy-to-use SDKs for developers

**Why it matters:**
- No centralized game servers needed
- Players can verify fairness independently
- All game logic runs on immutable smart contracts
- Perfect for PvP games, gambling, tournaments

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- Algorand wallet (Pera Wallet, Defly, etc.)
- Some TestNet ALGOs for testing

### Option 1: Install from npm
```bash
npm install fair-play-kit
```

### Option 2: Clone for development
```bash
git clone https://github.com/YOGESH9139/fair-play-kit.git
cd fair-play-kit
npm install
```

### Basic Usage
```typescript
import FairPlaySDK from './fair-play-module/sdk';

// Initialize SDK
const sdk = new FairPlaySDK(APP_ID, ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

// Create a match
const globalState = await sdk.getGlobalState();
const matchId = globalState.get("match_counter") + 1;
const txns = await sdk.createMatch(myAddress, betAmount, matchId);

// Sign and send transactions with wallet
```

---

## 🔗 Deployed Smart Contracts & Assets

### TestNet Deployment

**Smart Contract:**
- App ID: `748642793`
- View on Lora: [https://lora.algokit.io/testnet/application/748642793](https://lora.algokit.io/testnet/application/740915050)

**Verification:**
You can verify all contract interactions, match states, and game outcomes on-chain using the Lora explorer.

---

## 🧠 Architecture & Components

### How It Works

```
┌─────────────────────┐
│   React Frontend    │  ← Players interact here
│   (game-demo.tsx)   │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   FairPlay SDK      │  ← Handles transactions
│   (fairplay.js)     │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Smart Contract     │  ← Game logic on-chain
│  (fair_play.py)     │
└─────────────────────┘
```

### Core Components

**1. Smart Contract (PyTeal)**
- Manages match creation and state
- Implements commit-reveal protocol
- Handles game resolution and payouts
- Uses Algorand Box storage for match data

**2. SDK (TypeScript/JavaScript)**
- Creates and signs transactions
- Predicts match IDs
- Manages box references
- Simple API: `createMatch()`, `joinMatch()`, `commitMove()`, `revealMove()`, `resolveMatch()`

**3. Frontend (React)**
- Wallet integration via `@txnlab/use-wallet-react`
- Real-time match state updates
- Demo Rock-Paper-Scissors game

### Game Flow

1. **Player 1** creates a match with a wager → Gets Match ID
2. **Player 2** joins using the Match ID → Match starts
3. Both players commit their moves (hashed with secret salt)
4. Both players reveal their moves
5. Smart contract determines winner → Funds released automatically

---

## 🌐 Deployed Frontend

**Live Demo:** [https://fair-play-kit.vercel.app/](https://fair-play-kit.vercel.app/)

**Try it out:**
1. Visit the demo page
2. Connect your Algorand wallet
3. Create or join a Rock-Paper-Scissors match
4. Play and verify fairness on-chain!

**Features:**
- ✅ Wallet connection (Pera, Defly, etc.)
- ✅ Live match creation and joining
- ✅ Real-time game state
- ✅ On-chain verification

---

## 📚 API Reference

### SDK Methods

#### `createMatch(sender, wager, matchId)`
Creates a new game lobby. Returns unsigned transaction.

#### `joinMatch(sender, matchId)`
Joins an existing match. Returns unsigned transaction.

#### `commitMove(sender, matchId, move, salt)`
Commits a hashed move to the contract.

#### `revealMove(sender, matchId, move, salt)`
Reveals the move. Must match committed hash.

#### `resolveMatch(sender, matchId)`
Triggers game resolution and payout.

#### `getGlobalState()`
Reads contract state (match counter, etc.).

#### `getMatchState(matchId)`
Reads specific match data from box storage.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, TailwindCSS
- **Smart Contracts:** PyTeal, Python
- **Blockchain:** Algorand TestNet
- **SDK:** TypeScript/JavaScript
- **Tools:** AlgoSDK, AlgoKit, Pera Wallet
- **Deployment:** Vercel (Frontend), Algorand CLI (Contracts)

---

## 🚀 For Developers

### Quick Integration

1. **Deploy the smart contract:**
   ```bash
   algokit deploy
   # Note your App ID
   ```

2. **Install the SDK:**
   ```bash
   npm install fair-play-kit
   ```

3. **Initialize in your app:**
   ```typescript
   import FairPlaySDK from 'fair-play-kit';
   const sdk = new FairPlaySDK(YOUR_APP_ID, token, server, port);
   ```

4. **Build your game logic** using the SDK methods

### Use Cases
- 🎲 Dice games
- 🃏 Card games
- ✊ Rock-Paper-Scissors
- 🏆 Tournaments
- 🎰 Prediction markets
- ⚔️ PvP battles

---

## 📖 Documentation

Complete documentation: [https://fair-play-kit.vercel.app/docs](https://fair-play-kit.vercel.app/docs)

- Core Functions
- Integration Guide
- API Reference
- Example Games

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

---

---

## 👨‍💻 Developer

**YOGESH** - [@YOGESH9139](https://github.com/YOGESH9139)

Built for **AlgoBharat Hackseries 2025**

---

## 🔗 Links

- **Website:** [https://fair-play-kit.vercel.app/](https://fair-play-kit.vercel.app/)
- **Demo:** [https://fair-play-kit.vercel.app/demo](https://fair-play-kit.vercel.app/demo)
- **Docs:** [https://fair-play-kit.vercel.app/docs](https://fair-play-kit.vercel.app/docs)
- **GitHub:** [https://github.com/YOGESH9139/fair-play-kit](https://github.com/YOGESH9139/fair-play-kit)
- **Contract on Lora:** [https://lora.algokit.io/testnet/application/740915050](https://lora.algokit.io/testnet/application/740915050)

---

**Made with ❤️ for the Algorand Ecosystem**
