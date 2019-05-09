/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const db = require('./levelSandbox');
const Block = require('./Block')

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor() {
    this.genereateGenesisBlock();
  }

  genereateGenesisBlock() {
    return this.getBlockHeight().then((height) => {
      if (height === 0) {
        console.log('\nGenesis Block being created...');
        let genesisBlock = new Block.Block('Genesis Block');
        genesisBlock.time = new Date().getTime().toString().slice(0, -3);
        genesisBlock.height = height;
        genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();
        console.log(genesisBlock);
        db.addLevelDBData(height, JSON.stringify(genesisBlock).toString())
          .then((genesisBlock) => {
            console.log('Added Genesis Block:');
            console.log(genesisBlock);
          }).catch((err) => {
            console.log('Unable to add Genesis block!', err);
          });
      } else {
        console.log('\nGenesis Block already exists');
      }
    }).catch((err) => {
      console.log('Unable to add Genesis Block!', err);
    })
  }

  // Add new block
  addBlock(newBlock) {
    return new Promise((resolve, reject) => {
      // Block height
      this.getBlockHeight().then((height) => {
        newBlock.height = height;
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        console.log(height)
        return height;
      }).then((height) => {
        this.getBlock(height - 1).then((lastBlock)=>{
          // previous block hash
          newBlock.previousBlockHash = lastBlock.hash;
          // Block hash with SHA256 using newBlock and converting to a string
          newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
          db.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString())
        }).catch((err)=>{
          reject('Unable to get previous block! => block not added.', err);
        })
      })
    });
  }

  // Get block height
  getBlockHeight() {
    return new Promise((resolve, reject) => {
      db.getCountEntries().then((height) => {
        resolve(height);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  // get block
  getBlock(blockHeight) {
    return new Promise((resolve, reject) => {
      db.getLevelDBData(blockHeight).then((value) => {
        resolve(JSON.parse(value));
      }).catch((err) => {
        reject(err);
      });
    });
  }

  // validate block
  validateBlock(blockHeight) {
    return new Promise((resolve, reject) => {
      this.getBlock(blockHeight).then((block) => {
        let blockHash = block.hash;
        block.hash = '';
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        if (blockHash == validBlockHash) {
          console.log('Block #' + blockHeight + ' Valid Block');
          resolve(true);
        } else {
          console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
          reject(false);
        }
      }).catch((err) => {
        console.log('Unable to get block #' + blockHeight);
        reject(err);
      })
    });
  }

  // Validate blockchain
  validateChain() {
    let errorLog = [];
    for (var i = 0; i < this.chain.length - 1; i++) {
      // validate block
      if (!this.validateBlock(i)) errorLog.push(i);
      // compare blocks hash link
      let blockHash = this.chain[i].hash;
      let previousHash = this.chain[i + 1].previousBlockHash;
      if (blockHash !== previousHash) {
        errorLog.push(i);
      }
    }
    if (errorLog.length > 0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: ' + errorLog);
    } else {
      console.log('No errors detected');
    }
  }
}
module.exports.Blockchain = Blockchain;