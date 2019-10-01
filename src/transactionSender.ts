import {
  Oep4,
  Crypto,
  Transaction,
  TransactionBuilder,
  RestClient,
  utils
} from 'ontology-ts-sdk'

const gasPrice = '500'
const gasLimit = '3924288'
const TESTNET_NODE = 'http://polaris4.ont.io:20334'
const MAINNET_NODES = [
  'https://dappnode1.ont.io:20334',
  'https://dappnode2.ont.io:20334',
  'https://dappnode3.ont.io:20334',
  'https://dappnode4.ont.io:20334'
]

const getMainnetNode = () => {
  return MAINNET_NODES[Math.floor(Math.random() * MAINNET_NODES.length)]
}

export function makeTransferMultiTx (
  tokenContract: string,
  payer: string,
  arrTo: string[][]
) {
  const contractAddr = new Crypto.Address(utils.reverseHex(tokenContract))
  const payerAddr = new Crypto.Address(payer)
  const Oep4Tx = new Oep4.Oep4TxBuilder(contractAddr)

  // create Oep4States from arrTo
  const states: Oep4.Oep4State[] = arrTo.map(row => {
    const toAddr = new Crypto.Address(row[0])
    return new Oep4.Oep4State(payerAddr, toAddr, row[1])
  })
  return Oep4Tx.makeTransferMultiTx(states, gasPrice, gasLimit, payerAddr)
}

export function makeTransferTxArr (
  tokenContract: string,
  payer: string,
  arrTo: string[][]
) {
  const contractAddr = new Crypto.Address(utils.reverseHex(tokenContract))
  const payerAddr = new Crypto.Address(payer)
  const Oep4Tx = new Oep4.Oep4TxBuilder(contractAddr)

  // create Oep4States from arrTo
  return arrTo.map(row => {
    const toAddr = new Crypto.Address(row[0])
    return Oep4Tx.makeTransferTx(
      payerAddr,
      toAddr,
      row[1],
      gasPrice,
      gasLimit,
      payerAddr
    )
  })
}

export function signTransaction (tx: Transaction, privateKey: string): void {
  const pk = new Crypto.PrivateKey(privateKey)
  TransactionBuilder.signTransaction(tx, pk)
  TransactionBuilder.addSign(tx, pk)
}

export function execTransaction (tx: Transaction, testnet: boolean) {
  const node = testnet ? TESTNET_NODE : getMainnetNode()
  const restClient = new RestClient(node)
  console.log('Sending transaction through:', node)
  return restClient.sendRawTransaction(tx.serialize(), false)
}
