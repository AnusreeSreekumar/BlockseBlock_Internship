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
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true
  }
}

let myChain = new Blockchain();

myChain.addBlock(new Block(1, new Date().toISOString(), { amount: 100}));
myChain.addBlock(new Block(2, new Date().toISOString(), { amount: 500}));

console.log("My Blockchain: ",JSON.stringify(myChain, null,4));

myChain.chain[1].data = { amount: 1000 };
myChain.chain[1].hash = myChain.chain[1].calculateHash();

console.log("Is blockchain valid? ", myChain.isChainValid());