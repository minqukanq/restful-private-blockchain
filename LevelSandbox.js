/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';
const SHA256 = require('crypto-js/sha256');
const Block = require('./Block.js');

class LevelSandbox {

  constructor() {
    this.db = level(chainDB);
  }

  // Add records in the LevelDB
  addDataToLevelDB(key, value) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.db.put(key, value, function (err) {
        if (err) reject('Block ' + key + ' submission failed');
      })
      if (key == 0)
        resolve("Success to insert the Genesis Block");
      else
        //resolve("Success to insert the new block " + key);
        resolve(value);
    });
  }

  // Add block
  // Auxiliary method to prepare the recording in LevelDB
  addBlock(newBlock) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.getBlocksCount().then((height) => {
        //console.log(height);
        if (height >= 0) {
          self.getBlock(height).then((bloco) => {
            var chainHeight = height;
            newBlock.height = chainHeight + 1;
            // UTC timestamp
            newBlock.time = new Date().getTime().toString().slice(0, -3);
            // previous block hash
            newBlock.previousBlockHash = bloco.hash;
            // Block hash with SHA256 using newBlock and converting to a string
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            //Record in database
            self.db.createReadStream()
              .on('data', function (data) {
                //do nothing
              })
              .on('error', function (err) {
                reject(err)
              })
              .on('close', function () {
                resolve(self.addDataToLevelDB(newBlock.height, JSON.stringify(newBlock).toString()));
              });

          }).catch((err) => { reject(err); });
        } else {
          newBlock.height = 0;
          newBlock.time = new Date().getTime().toString().slice(0, -3);
          newBlock.previousBlockHash = "";
          newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
          resolve(self.addDataToLevelDB(newBlock.height, JSON.stringify(newBlock).toString()));
        }

      }).catch((err) => { reject(err); });
    });
  }

  // Return a specific block
  getBlock(blockHeight) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.db.get(blockHeight, function (err, value) {
        if (err) {
          reject('Block Not Found!', err);
        } else {
          let b = new Block.Block("");
          b.hash = JSON.parse(value).hash;
          b.height = JSON.parse(value).height;
          b.body = JSON.parse(value).body;
          b.time = JSON.parse(value).time;
          b.previousBlockHash = JSON.parse(value).previousBlockHash;
          resolve(b);
        }

      });
    })
  }

  // Method that return the height of the chain
  getBlocksCount() {
    let self = this;
    return new Promise(function (resolve, reject) {
      let i = -1;
      self.db.createReadStream().
        on('data', function (data) {
          i++;
        }).on('error', function (err) {
          reject(err);
        }).on('close', function () {
          resolve(i);
        });
    })
  }

  // Method that validate a specific block
  validateBlock(height) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.db.get(height, function (err, value) {
        if (err) reject('Not found!', err);
        let b = new Block.Block("");
        b.hash = JSON.parse(value).hash;
        b.height = JSON.parse(value).height;
        b.body = JSON.parse(value).body;
        b.time = JSON.parse(value).time;
        b.previousBlockHash = JSON.parse(value).previousBlockHash;
        let blockHash = b.hash;;
        b.hash = '';
        let validBlockHash = SHA256(JSON.stringify(b)).toString();
        if (blockHash === validBlockHash) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  // Validate the entire blockchain
  validateChain() {
    let self = this;
    return new Promise((resolve, reject) => {
      let errorLog = [];
      let promises = [];
      self.getBlocksCount().then((height) => {
        for (var i = 0; i <= height; i++) {
          promises.push(self.validateBlock(i));
        }
        Promise.all(promises)
          .then((valid) => {
            for (var i = 0; i < valid.length; i++) {
              if (valid[i]) {
                //do nothing
              }
              else {
                errorLog.push("Block " + i + " is not valid!");
              }
            }
            resolve(errorLog);
          })
          .catch((e) => {
            // handle errors here
          });
      }).catch((err) => { console.log(err); });
    });
  }

  // Add data to levelDB with key and value
  addLevelDBData(key, value) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.db.put(key, value, function (err) {
        if (err) {
          //console.log('Update of Block ' + key + ' failed', err);
          reject(false);
        } else {
          //console.log('Block ' + key + ' was updated');
          resolve(true);
        }
      })
    });
  }

  // Get data from levelDB with key (Promise)
  /*getLevelDBData(key){
      let self = this;
      return new Promise(function(resolve, reject) {
          // Add your code here, remember un Promises you need to resolve() or reject()
      });
  }*/
}

module.exports.LevelSandbox = LevelSandbox;