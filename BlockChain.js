    /* ===== Blockchain Class ==========================
    |  Class with a constructor for new blockchain 		|
    |  ================================================*/
    const SHA256 = require('crypto-js/sha256');
    const LevelSandbox = require('./LevelSandbox.js');
    const Block = require('./Block.js');

    class Blockchain {

        constructor() {
            this.db = new LevelSandbox.LevelSandbox();
            this.generateGenesisBlock();
        }

        // Generate the Genesis Block (the first block)
        generateGenesisBlock(){
            this.getBlockHeight().then((height) => {
                if (height == -1){
                    this.addBlock(new Block.Block("Genesis Block")).then((result) => {
                        console.log("Success to insert the Genesis Block");
                    }).catch((err) =>  {
                        console.log(err);
                    });
                }
            }).catch((err) => { console.log(err);});
        }

        // Get block height, it is auxiliar method that return the height of the blockchain
        getBlockHeight() {
            return this.db.getBlocksCount();
        }

        // Add new block
        addBlock(block) {
            return this.db.addBlock(block); 
        }

        // Get Block By Height
         getBlock(height) {
            return this.db.getBlock(height);
        }

        // Validate if Block is being tampered by Block Height
        validateBlock(height) {
            return this.db.validateBlock(height);
        }

        // Validate the entire Blockchain
        validateChain() {
            return this.db.validateChain();
        }

        // Utility Method to Tamper a Block for Test Validation
        // This method is for testing purpose
        _modifyBlock(height, block) {
            return this.db.addLevelDdbata(height, JSON.stringify(block).toString());
        }
       
    }

    module.exports.Blockchain = Blockchain;