const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChain = require('./BlockChain.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    constructor(app) {
        this.app = app;
        this.blockChain = new BlockChain.Blockchain();
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    getBlockByIndex() {
        this.app.get("/block/:blockHeight", (req, res) => {
            return this.blockChain.getBlock(req.params.blockHeight).then(result => {
                res.set({'Connection': 'close'});
                res.status(200).json(result);
                res.end();
                }, error => {
                    res.status(404).send('Block not found!\n\n');
            });
        });
    }

    postNewBlock() {
        this.app.post("/block", (req, res) => {
            if (req.body.data) {
                console.log(req.body.data)
                return this.blockChain.addBlock(new BlockClass.Block(req.body.data)).then(result => {
                    res.status(201).json(result);
                }, error => {
                    res.status(500).send('Uknown error occurred on server side. Please retry later.\n\n')
                })
            } else {
                res.status(403).send('Block data must not be empty - please resend request with json object containing desired block data.\n\n')
            }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        let blockHeight = this.blockChain.getBlockHeight();
        if(blockHeight === 0){
            for (let index = 1; index < 10; index++) {
                let blockAux = new BlockClass.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blockChain.addBlock(blockAux);
            }
        }
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}