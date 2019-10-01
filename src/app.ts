import 'regenerator-runtime/runtime'
import { transformCsvToArray, isCsvFormatCorrect } from './csv'
import program from 'commander'
import {
  makeTransferMultiTx,
  signTransaction,
  execTransaction,
  makeTransferTxArr
} from './transactionSender'
import { splitArrayIntoChunks, sleep } from './util'

program.version('v0.0.1')
program
  .option(
    '-f, --file <file>',
    'file to parse location, should be a CSV with "address,amount" format'
  )
  .option('-p, --privateKey <privateKey>', 'sender private key')
  .option('-a, --address <address>', 'sender address')
  .option('-t, --token <tokenContract>', 'token contract address')
  .option('-tn, --testnet', 'send through testnet')
  .option('-s, --single', 'uses single transfers instead of multi')
  .parse(process.argv)

const paramsList = ['file', 'privateKey', 'address', 'token']

async function main () {
  if (paramsList.some(k => !program[k])) {
    paramsList.forEach(k => {
      if (!program[k]) {
        console.error(`Parameter "${k}" is missing.`)
      }
    })
    console.error('Something goes wrong.')
    process.exit(0)
  }

  const csvContent = transformCsvToArray(program.file)
  const checkCsvContent = isCsvFormatCorrect(csvContent)

  if (!checkCsvContent) {
    console.error('CSV content is incorrect')
    process.exit(0)
  }

  if (program.single) {
    const transfers = makeTransferTxArr(
      program.token,
      program.address,
      csvContent
    )

    transfers.forEach(t => signTransaction(t, program.privateKey))

    const batches = splitArrayIntoChunks(transfers, 400)

    for (const batch of batches) {
      await Promise.all(
        batch.map(t => execTransaction(t, program.testnet))
      ).then(async result => {
        console.log('---- TRANSACTIONS DONE ----')
        console.log(JSON.stringify(result))

        await sleep(1000)
      })
    }
  } else {
    const csvBatches = splitArrayIntoChunks(csvContent, 400)

    const txsMulti = csvBatches.map(b => {
      const txB = makeTransferMultiTx(program.token, program.address, b)
      signTransaction(txB, program.privateKey)
      return txB
    })

    for (const batch of txsMulti) {
      await execTransaction(batch, program.testnet).then(async result => {
        console.log('---- TRANSACTIONS DONE ----')
        console.log(JSON.stringify(result))

        await sleep(1000)
      })
    }
  }
}

main()
