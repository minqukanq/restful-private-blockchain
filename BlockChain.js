    /* ===== Blockchain Class ==========================
    |  Class with a constructor for new blockchain 		|
    |  ================================================*/
    const SHA256 = require('crypto-js/sha256');
    const LevelSandbox = require('./LevelSandbox.js');
    const Block = require('./Block.js');

    class Blockchain {

        constructor() {
            this.bd = new LevelSandbox.LevelSandbox();
            this.generateGenesisBlock();
        }

        // Generate the Genesis Block (the first block)
        generateGenesisBlock(){
            this.getBlockHeight().then((height) => {
                if (height == -1){
                    this.addBlock(new Block.Block("Genesis Block")).then((result) => {
                        console.log(result);
                    }).catch((err) =>  {
                        console.log(err);
                    });
                }
            }).catch((err) => { console.log(err);});
        }

        // Get block height, it is auxiliar method that return the height of the blockchain
        getBlockHeight() {
            return this.bd.getBlocksCount();
        }

        // Add new block
        addBlock(block) {
            return this.bd.addBlock(block); 
        }

        // Get Block By Height
         getBlock(height) {
            return this.bd.getBlock(height);        
        }

        // Validate if Block is being tampered by Block Height
        validateBlock(height) {
            return this.bd.validateBlock(height);
        }

        // Validate the entire Blockchain
        validateChain() {
            return this.bd.validateChain();
        }

        // Utility Method to Tamper a Block for Test Validation
        // This method is for testing purpose
        _modifyBlock(height, block) {
            return this.bd.addLevelDBData(height, JSON.stringify(block).toString());
        }
       
    }

    module.exports.Blockchain = Blockchain;