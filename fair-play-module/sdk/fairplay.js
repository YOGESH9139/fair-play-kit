import * as algosdk from "algosdk";
import { Buffer } from "buffer"; // Make sure buffer is installed: npm install buffer

class FairPlaySDK {
    constructor(appId, algodToken, algodServer, algodPort) {
        this.appId = appId;
        this.algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
    }

    async getGlobalState() {
        try {
            const appInfo = await this.algodClient.getApplicationByID(this.appId).do();
            const globalState = new Map();
            if (appInfo.params["global-state"]) {
                appInfo.params["global-state"].forEach(item => {
                    const key = Buffer.from(item.key, 'base64').toString();
                    const value = item.value.uint; // Assumes uint, adjust if needed
                    globalState.set(key, value);
                });
            }
            return globalState;
        } catch (error) {
            console.error("Error fetching global state:", error);
            return new Map(); // Return empty map on error
        }
    }

    _getMatchBoxName(matchId) {
        // Ensure matchId is a number
        const id = typeof matchId === 'string' ? parseInt(matchId, 10) : matchId;
         if (isNaN(id)) {
            throw new Error("Invalid matchId provided to _getMatchBoxName");
         }
        return new Uint8Array(Buffer.concat([Buffer.from("match_"), algosdk.encodeUint64(id)]));
    }

    async generateMoveHash(move, salt) {
        const encoder = new TextEncoder();
        const data = new Uint8Array([...encoder.encode(move), ...encoder.encode(salt)]);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return new Uint8Array(hashBuffer);
    }

    async createMatch(senderAddress, wagerAmount, nextMatchId) {
        const params = await this.algodClient.getTransactionParams().do();
        const appArgs = [new Uint8Array(Buffer.from('create')), algosdk.encodeUint64(wagerAmount)];
        const txn = algosdk.makeApplicationNoOpTxnFromObject({
            sender: senderAddress,
            suggestedParams: params,
            appIndex: this.appId,
            appArgs: appArgs,
            boxes: [{ appIndex: this.appId, name: this._getMatchBoxName(nextMatchId) }]
        });
        return [txn];
    }

    async joinMatch(senderAddress, matchId) {
        const params = await this.algodClient.getTransactionParams().do();
        const txn = algosdk.makeApplicationNoOpTxnFromObject({
            sender: senderAddress,
            suggestedParams: params,
            appIndex: this.appId,
            appArgs: [new Uint8Array(Buffer.from('join')), algosdk.encodeUint64(matchId)],
            boxes: [{ appIndex: this.appId, name: this._getMatchBoxName(matchId) }]
        });
        return [txn];
    }

    async commitMove(senderAddress, matchId, move, salt) {
        const moveHash = await this.generateMoveHash(move, salt);
        const params = await this.algodClient.getTransactionParams().do();
        const txn = algosdk.makeApplicationNoOpTxnFromObject({
            sender: senderAddress,
            suggestedParams: params,
            appIndex: this.appId,
            appArgs: [new Uint8Array(Buffer.from('commit')), algosdk.encodeUint64(matchId), moveHash],
            boxes: [{ appIndex: this.appId, name: this._getMatchBoxName(matchId) }]
        });
        return [txn];
    }

    async revealMove(senderAddress, matchId, move, salt) {
        const params = await this.algodClient.getTransactionParams().do();
        const txn = algosdk.makeApplicationNoOpTxnFromObject({
            sender: senderAddress,
            suggestedParams: params,
            appIndex: this.appId,
            appArgs: [
                new Uint8Array(Buffer.from('reveal')),
                algosdk.encodeUint64(matchId),
                new Uint8Array(Buffer.from(move.toString())),
                new Uint8Array(Buffer.from(salt))
            ],
            boxes: [{ appIndex: this.appId, name: this._getMatchBoxName(matchId) }]
        });
        return [txn];
    }

    async resolveMatch(senderAddress, matchId) {
        const params = await this.algodClient.getTransactionParams().do();
        const txn = algosdk.makeApplicationNoOpTxnFromObject({
            sender: senderAddress,
            suggestedParams: params,
            appIndex: this.appId,
            appArgs: [new Uint8Array(Buffer.from('resolve')), algosdk.encodeUint64(matchId)],
            boxes: [{ appIndex: this.appId, name: this._getMatchBoxName(matchId) }]
        });
        return [txn];
    }

    async getMatchState(matchId) {
        const boxNameBytes = this._getMatchBoxName(matchId);
        const boxData = await this.algodClient.getApplicationBoxByName(this.appId, boxNameBytes).do();
        const data = boxData.value;
        // Basic check for expected data length
        if (data.length < 192) {
             throw new Error(`Box data for match ${matchId} is too short.`);
        }
        return {
            player1: algosdk.encodeAddress(data.slice(0, 32)),
            player2: algosdk.encodeAddress(data.slice(32, 64)),
            // Use DataView for safer BigInt reading
            wager: new DataView(data.buffer, data.byteOffset).getBigUint64(64, false), // Big-endian
            state: new DataView(data.buffer, data.byteOffset).getBigUint64(72, false), // Big-endian
            p1Commitment: Buffer.from(data.slice(80, 112)).toString('hex'),
            p2Commitment: Buffer.from(data.slice(112, 144)).toString('hex'),
            p1Move: new DataView(data.buffer, data.byteOffset).getBigUint64(144, false), // Big-endian
            p2Move: new DataView(data.buffer, data.byteOffset).getBigUint64(152, false), // Big-endian
            winner: algosdk.encodeAddress(data.slice(160, 192))
        };
    }
}

export default FairPlaySDK;