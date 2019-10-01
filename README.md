# Ontology airdrop

An script to deploy air drops in Ontology blockchain from a CSV file. It uses the _makeTransferMultiTx_ feature.

## Quick start

Clone the project, the change your workdir to the project directory and install the dependencies:

```
git clone git@github.com:deblanco/ontology-airdrop.git
cd ontology-airdrop
npm install
```

## Arguments

The script should be executed in the next form:

```
npm start -- -f csvFile.csv -p senderAddressPrivateKey -a senderAddress -t tokenContractAddress
```

```
Options:
  -V, --version                  output the version number
  -f, --file <file>              file to parse location, should be a CSV with "address,amount" format
  -p, --privateKey <privateKey>  sender private key
  -a, --address <address>        sender address
  -t, --token <tokenContract>    token contract address
  -tn, --testnet                 send through testnet
  -s, --single                   uses single transfers instead of multi
  -h, --help                     output usage information
```

## Input CSV file

The CSV that contains the addresses which will receive the airdrop should be formatted in the next way: \<address>,\<amount>

```csv
AKC7QQqCt4s7qveBM4dAi3ivrRmLbCJuWF,12
AKC7QQqCt4s7qveBM4dAi3ivrRmLbCJuWF,13
AKC7QQqCt4s7qveBM4dAi3ivrRmLbCJuWF,15
AKC7QQqCt4s7qveBM4dAi3ivrRmLbCJuWF,1100000000
```

**Note: The amount field should include the decimals!**

## Example

```
npm start -- -f test.csv -a AMwHX7Ste8MhDNf3VuVR36greND8F67ets -p d9d1392ae21cbe8b910311b9c3016f8f995ac45c811d5896e5c2606fe01a45fb -t d01be91dd3d9c0f09cedef20298e73109a788397 --testnet
```

## Others

The gas price and limit has been setup with standard values:

```javascript
const gasPrice = '500';
const gasLimit = '3924288';
```

The transactions are sent in batches of 400 transactions to not saturate the network and due to Multi transaction limits.

## Credits

Daniel Blanco &copy; 2019
