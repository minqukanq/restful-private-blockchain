const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChain = require('./BlockChain.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blockchain = new BlockChain.Blockchain();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", (req, res) => {
            this.blockchain.getBlock(req.params.index)
                .then((block) => {
                        res.status(200).json( block );
                }).catch((err) => {
                        res.status(404).send("Block not found!\n");
                });
        });

        this.app.get("/block/", (req, res) => {
            res.status(400).send("You must ask for a valid block!");
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block/", (req, res) => {
            let data = req.body.data;
            if(req.body.data === ''){
                res.status(400).send("You must send valid request");
            }  
            let block = new BlockClass.Block(data);
            this.blockchain.addBlock(block).then((result) => {
                res.status(201).json( JSON.parse(result) );
            }).catch(err=>{
                res.status(403).send( "You can't add Block");
            });
        });
    }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}