import { time } from "console";
import crypto from "crypto";

class Block {
  constructor(index, timestamp, data, previousHash = "", nonce = 0) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.hash = this.calculateHash();
  }
  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.timestamp +
          JSON.stringify(this.data) +
          this.previousHash +
          this.nonce
      )
      .digest("hex");
  }

  mineBlock(difficulty) {

    const startTime = new Date();

    while (!this.hash.startsWith("0".repeat(difficulty))) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // in seconds

    console.log(`Block mined!`);
    console.log(`Hash: ${this.hash}`);
    console.log(`Nonce: ${this.nonce}`);
    console.log(`Time taken: ${timeTaken} seconds`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(4);
    this.chain.push(newBlock);
  }

}

let myChain = new Blockchain();

myChain.addBlock(new Block(1, new Date().toISOString(), { amount: 100}));
