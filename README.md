# RESTful WEB API with Express.js framework for private Blockchain service

In this project, I built a RESTful API using Express.js that interface with my private blockchain. This project is consist of two end points for use this api.
 - GET Block
 - POST Block

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
To install the software, you need to doownload the following:
1. Install [Node.js](https://nodejs.org/en/) on your computer.
2. Clone or download the repository to your local computer.
3. Open the terminal and install the packages: `npm install`.
4. Initialize node.js project where files are located.
```
npm init
```

### Installing

This project has the following dependencies:
```
  "dependencies": {
    "body-parser": "^1.19.0",
    "crypto-js": "^3.1.9-1",
    "express": "^4.16.4",
    "level": "^5.0.1"
  }
```

You can install and save dependencies:
```
npm install crypto-js --save
npm install level --save
npm install body-parser --save
npm install express --save
```


## Running the application
Run your application node app.js.
```
node app.js
```
 - The REST API provides us two endpoints to interact with our private Blockchain
The API is runs on localhost, with port 8000.



##Test the application

#### GET Block
 * URL : `/block/{BLOCK_HEIGHT}`

 * Method : `GET`

 * URL Path Params : `BLOCK_HEIGHT (Retrive Block Height)`

   ***

```
curl --request GET -i http://localhost:8000/block/0  # will return Block #0 from blockchain
```
#### POST Block
* URL :     /block
* Method : `GET`
* Request Body : `{"data" : "some data example"}`

```
curl -X POST \
  http://localhost:8000/block \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 1e551722-4382-49cc-84f1-19d3d433c1e7' \
  -d '{
    "data":"Some data example"
}'
```



## Built With

* [Node.js](https://nodejs.org/en/) - The JavaScript runtime used
* [Express.js](http://expressjs.com/) - The web API framework used
* [LevelDB](https://github.com/google/leveldb) - Used to persist blockchain data on disk




## Authors

* **Mingu Kang** - [Github](https://github.com/minqukanq)
