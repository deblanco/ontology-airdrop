import {
  Oep4,
  Crypto,
  Transaction,
  TransactionBuilder,
  RestClient,
  utils
} from 'ontology-ts-sdk'

const gasPrice = '500'
const gasLimit = '200000'
const TESTNET_NODE = 'http://polaris4.ont.io:20334'
const MAINNET_NODE = 'https://dappnode1.ont.io:10334'

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
  const restClient = new RestClient(testnet ? TESTNET_NODE : MAINNET_NODE)
  return restClient.sendRawTransaction(tx.serialize(), false)
}
