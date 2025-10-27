"use client"

import { useState, useEffect } from "react";
import FairPlaySDK from "../fair-play-module/sdk";
import { useWallet } from "@txnlab/use-wallet-react";
import * as algosdk from "algosdk";

interface GameResult {
  id: number; bet: number; playerChoice: string; computerChoice: string;
  result: "win" | "lose" | "draw"; multiplier: number; timestamp: Date;
  txId?: string; matchId?: string;
}

const CHOICES = ["Rock", "Paper", "Scissors"];
const CHOICE_EMOJIS: Record<string, string> = { Rock: "🪨", Paper: "📄", Scissors: "✂️" };
const ALGORAND_ZERO_ADDRESS = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ";

export function GameDemo() {
  const { signTransactions, activeAddress, algodClient, isReady } = useWallet();
  
  const [isMounted, setIsMounted] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null); // Stores the current match ID as a string
  const [gameStatus, setGameStatus] = useState<"idle" | "creating" | "waiting_for_opponent" | "committed" | "revealing" | "settled">("idle");
  const [salt, setSalt] = useState<string | null>(null);
  const [currentBet, setCurrentBet] = useState(0);
  const [showCreateMatch, setShowCreateMatch] = useState(true);
  const [matchIdInput, setMatchIdInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // For displaying errors

  const APP_ID = 748599581; // Make sure this is your latest DEPLOYED App ID
  const ALGOD_TOKEN = "a".repeat(64);
  const ALGOD_SERVER = "https://testnet-api.algonode.cloud";
  const ALGOD_PORT = "";
  const sdk = new FairPlaySDK(APP_ID, ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

  useEffect(() => { setIsMounted(true); }, []);

  const generateSalt = (): string => window.crypto.getRandomValues(new Uint8Array(16)).toString();

  const handleTransaction = async (unsignedTxns: algosdk.Transaction[]) => {
    setErrorMsg(null); // Clear previous errors
    try {
        const encodedTxns = unsignedTxns.map(txn => algosdk.encodeUnsignedTransaction(txn));
        const signedTxnsResult = await signTransactions(encodedTxns);
        const signedTxns = signedTxnsResult.filter(txn => txn !== null);
        if (signedTxns.length !== unsignedTxns.length) {
          throw new Error("Transaction signing was cancelled or failed.");
        }
        console.log("Sending signed transactions...");
        const { txid } = await algodClient.sendRawTransaction(signedTxns).do();
        console.log("Transaction sent, waiting for confirmation:", txid);
        await algosdk.waitForConfirmation(algodClient, txid, 4);
        console.log("Transaction confirmed:", txid);
        return txid;
    } catch (err: any) {
        console.error("Transaction failed:", err);
        setErrorMsg(`Transaction failed: ${err.message || "Unknown error"}`);
        throw err; // Re-throw the error so calling functions know it failed
    }
  };

  const createMatch = async () => {
    if (!betAmount || !activeAddress) return;
    try {
      setGameStatus("creating");
      const globalState = await sdk.getGlobalState();
      const currentMatchCounter = globalState.get("match_counter") || 0;
      const nextMatchId = currentMatchCounter + 1;
      console.log(`Predicting next Match ID will be: ${nextMatchId}`);
      const unsignedTxns = await sdk.createMatch(activeAddress, betAmount, nextMatchId);
      await handleTransaction(unsignedTxns);
      console.log(`Match ${nextMatchId} created successfully.`);
      setMatchId(String(nextMatchId)); 
      setCurrentBet(betAmount);
      setShowCreateMatch(false);
      setGameStatus("waiting_for_opponent");
    } catch (error) {
      console.error("Error creating match:", error);
      setGameStatus("idle"); // Reset status on failure
    }
  };

  const joinMatch = async () => {
    if (!matchIdInput || !activeAddress) return;
    let matchIdToJoin : number | null = null;
    try {
      matchIdToJoin = parseInt(matchIdInput, 10);
      if (isNaN(matchIdToJoin)) throw new Error("Invalid Match ID format.");

      setGameStatus("creating");
      console.log(`Attempting to join match ${matchIdToJoin}`);
      const unsignedTxns = await sdk.joinMatch(activeAddress, matchIdToJoin);
      await handleTransaction(unsignedTxns);
      console.log(`Successfully joined match ${matchIdToJoin}`);
      const state = await sdk.getMatchState(matchIdToJoin);
      setMatchId(matchIdInput);
      setCurrentBet(Number(state.wager));
      setShowCreateMatch(false);
      setGameStatus("idle");
    } catch (error) {
      console.error(`Error joining match ${matchIdToJoin}:`, error);
      setGameStatus("idle"); // Reset status on failure
    }
  };

  const commitMove = async (choice: string) => {
    if (!matchId || !activeAddress || isPlaying) return;
    let currentMatchIdNum : number | null = null;
    try {
      currentMatchIdNum = parseInt(matchId, 10);
      if (isNaN(currentMatchIdNum)) throw new Error("Invalid current Match ID.");

      setSelectedChoice(choice);
      setIsPlaying(true);
      setGameStatus("committed");
      const newSalt = generateSalt();
      setSalt(newSalt);
      console.log(`Committing move ${choice} for match ${currentMatchIdNum}`);
      const unsignedTxns = await sdk.commitMove(activeAddress, currentMatchIdNum, choice, newSalt);
      const txId = await handleTransaction(unsignedTxns);
      console.log(`Move committed successfully. TxID: ${txId}`);
      const gameResult: GameResult = { id: gameResults.length + 1, bet: currentBet, playerChoice: choice, computerChoice: "", result: "draw", multiplier: 0, timestamp: new Date(), txId, matchId };
      setGameResults([gameResult, ...gameResults]);
    } catch (error) {
      console.error(`Error committing move for match ${currentMatchIdNum}:`, error);
      setGameStatus("idle"); setIsPlaying(false); setSelectedChoice(null); // Reset on failure
    }
  };

  const revealMove = async () => {
    if (!matchId || !salt || !selectedChoice || !activeAddress) return;
    let currentMatchIdNum : number | null = null;
    try {
        currentMatchIdNum = parseInt(matchId, 10);
        if (isNaN(currentMatchIdNum)) throw new Error("Invalid current Match ID.");

        setGameStatus("revealing");
        console.log(`Revealing move ${selectedChoice} for match ${currentMatchIdNum}`);
        const revealTxns = await sdk.revealMove(activeAddress, currentMatchIdNum, selectedChoice, salt);
        const resolveTxns = await sdk.resolveMatch(activeAddress, currentMatchIdNum);
        const combinedTxns = [...revealTxns, ...resolveTxns];
        algosdk.assignGroupID(combinedTxns);
        const txId = await handleTransaction(combinedTxns);
        console.log(`Reveal/Resolve successful. TxID: ${txId}`);
        const finalState = await sdk.getMatchState(currentMatchIdNum);
        let multiplier = 0, newBalance = balance, finalResult: "win" | "lose" | "draw" = "lose";
        if (finalState.winner === activeAddress) {
            multiplier = 2; newBalance = balance + currentBet; finalResult = "win";
        } else if (String(finalState.winner) === ALGORAND_ZERO_ADDRESS || String(finalState.winner) === String(algosdk.getApplicationAddress(APP_ID))) {
            multiplier = 1; finalResult = "draw";
        } else {
            multiplier = 0; newBalance = balance - currentBet;
        }
        console.log(`Match ${currentMatchIdNum} result: ${finalResult}`);
        const updatedResults = [...gameResults];
        if (updatedResults.length > 0) {
            updatedResults[0] = { ...updatedResults[0], computerChoice: CHOICES[Number(finalState.p2Move)] || '?', result: finalResult, multiplier, txId };
        }
        setGameResults(updatedResults); setBalance(newBalance); setGameStatus("settled");
        setIsPlaying(false); setSelectedChoice(null); setSalt(null);
        setTimeout(() => { setMatchId(null); setShowCreateMatch(true); setGameStatus("idle"); }, 3000);
    } catch (error) {
        console.error(`Error revealing/resolving match ${currentMatchIdNum}:`, error);
        setGameStatus("committed"); // Revert status on failure
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (gameStatus === 'waiting_for_opponent' && matchId) {
      const currentMatchIdNum = parseInt(matchId, 10);
      if (isNaN(currentMatchIdNum)) return;

      console.log(`Polling for opponent join on match ${currentMatchIdNum}`);
      intervalId = setInterval(async () => {
        try {
          const state = await sdk.getMatchState(currentMatchIdNum);
          if (state.player2 !== ALGORAND_ZERO_ADDRESS) {
            console.log(`Opponent found for match ${currentMatchIdNum}! Starting game.`);
            if (intervalId) clearInterval(intervalId);
            setGameStatus('idle');
          } else {
             console.log(`Still waiting for opponent on match ${currentMatchIdNum}...`);
          }
        } catch (error: any) {
          if (error.status !== 404) {
             console.error(`Polling error for match ${currentMatchIdNum}:`, error);
          }
           if (intervalId) clearInterval(intervalId);
        }
      }, 5000); // Check every 5 seconds
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [gameStatus, matchId, sdk]);

  if (!isMounted || !isReady) {
    return (
      <div className="flex items-center justify-center rounded-xl border bg-card p-8 min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">Initializing Game...</h3>
          <p className="text-muted-foreground">Please wait, connecting to wallet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {errorMsg && (
        <div className="rounded-xl border border-red-500 bg-red-50 p-4 text-red-700">
          <h3 className="font-bold">Error</h3>
          <p>{errorMsg}</p>
          <button onClick={() => setErrorMsg(null)} className="mt-2 text-sm underline">Dismiss</button>
        </div>
      )}

      {showCreateMatch && (
         <div className="rounded-xl border bg-card p-8">
           <h3 className="mb-6 text-lg font-bold text-foreground">Create or Join a Match</h3>
           <div className="space-y-4">
             <button onClick={createMatch} disabled={!activeAddress || gameStatus === "creating"} className="w-full py-2 px-4 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50">
               {!activeAddress ? "Connect Wallet to Play" : gameStatus === "creating" ? "Creating..." : "Create a New Match"}
             </button>
             <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-card text-muted-foreground">Or</span></div></div>
             <div>
               <label className="block text-sm font-medium text-foreground mb-2">Join Existing Match</label>
               <input type="text" placeholder="Enter match ID" value={matchIdInput} onChange={(e) => setMatchIdInput(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-background text-foreground"/>
             </div>
             <button onClick={joinMatch} disabled={!activeAddress || gameStatus === "creating" || !matchIdInput} className="w-full py-2 px-4 rounded-lg bg-secondary text-secondary-foreground font-bold hover:opacity-90 disabled:opacity-50">
               {!activeAddress ? "Connect Wallet to Play" : gameStatus === "creating" ? "Joining..." : "Join Match"}
             </button>
           </div>
         </div>
      )}
      {!showCreateMatch && gameStatus === "waiting_for_opponent" && (
        <div className="rounded-xl border bg-card p-8 text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">Match Created!</h3>
          <p className="text-muted-foreground mb-4">Share this ID with your friend to start the game:</p>
          <div className="p-3 rounded-lg bg-background font-mono text-center mb-4">{matchId}</div>
          <p className="text-sm text-muted-foreground animate-pulse">Waiting for opponent to join...</p>
        </div>
      )}
      {!showCreateMatch && gameStatus !== "waiting_for_opponent" && (
        <div className="rounded-xl border bg-card p-8">
          <div className="mb-8">
             <div className="mb-2 flex items-center justify-between">
               <span className="text-sm font-medium text-muted-foreground">Your Balance</span>
               <span className="text-3xl font-bold text-primary">{balance} ALGO</span>
             </div>
             <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
               <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${Math.min((balance / 1000) * 100, 100)}%` }} />
             </div>
           </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bet Amount (ALGO)</label>
              <input type="number" value={currentBet} disabled className="w-full px-4 py-2 rounded-lg border bg-background text-foreground disabled:opacity-70" />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Status: <span className="font-bold text-foreground">
                {gameStatus === "idle" ? "Ready to Play" : gameStatus === "committed" ? "Waiting for Opponent / Ready to Reveal" : gameStatus === "revealing" ? "Revealing Move..." : "Match Settled"}
              </span></p>
              {matchId && <p>Match ID: {matchId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Choose Your Move</label>
              <div className="grid grid-cols-3 gap-3">
                {CHOICES.map((choice) => (
                  <button key={choice} onClick={() => commitMove(choice)}
                    disabled={isPlaying || gameStatus !== "idle"}
                    className={`py-4 px-3 rounded-lg font-bold transition-all ${selectedChoice === choice && isPlaying ? "bg-primary text-primary-foreground scale-95" : "bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50"}`}>
                    <div className="text-2xl mb-1">{CHOICE_EMOJIS[choice]}</div>
                    <div className="text-xs">{choice}</div>
                  </button>
                ))}
              </div>
            </div>
            {gameStatus === "committed" && selectedChoice && (
              <button onClick={revealMove} className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90">
                Reveal Your Move
              </button>
            )}
          </div>
        </div>
      )}
      {gameResults.length > 0 && (
         <div className="rounded-xl border bg-card p-8">
           <h3 className="mb-6 text-lg font-bold text-foreground">Game History</h3>
           <div className="space-y-3 max-h-96 overflow-y-auto">
             {gameResults.map((result) => (
               <div key={result.id} className={`flex items-center justify-between p-4 rounded-lg border ${ result.result === "win" ? "bg-green-50 border-green-200" : result.result === "draw" ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200" }`}>
                 <div className="flex items-center gap-4">
                   <div className="text-2xl">{result.result === "win" ? "🏆" : result.result === "draw" ? "🤝" : "💔"}</div>
                   <div>
                     <p className={`font-bold ${ result.result === "win" ? "text-green-700" : result.result === "draw" ? "text-blue-700" : "text-red-700" }`}>
                       {result.result === "win" ? "Won" : result.result === "draw" ? "Draw" : "Lost"} {result.bet} ALGO
                     </p>
                     <p className="text-xs text-muted-foreground">
                       {result.playerChoice && CHOICE_EMOJIS[result.playerChoice]} vs {result.computerChoice && CHOICE_EMOJIS[result.computerChoice]} • {result.timestamp.toLocaleTimeString()}
                     </p>
                     {result.txId && <p className="text-xs text-muted-foreground mt-1">TX: <span className="font-mono">{result.txId.substring(0, 12)}...</span></p>}
                   </div>
                 </div>
                 <span className={`text-lg font-bold ${ result.result === "win" ? "text-green-700" : result.result === "draw" ? "text-blue-700" : "text-red-700" }`}>
                   {result.result === "win" ? "+" : ""}{result.bet * (result.multiplier-1)} ALGO
                 </span>
               </div>
             ))}
           </div>
         </div>
      )}
    </div>
  );
}