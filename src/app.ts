import 'regenerator-runtime/runtime'
import { transformCsvToArray, isCsvFormatCorrect } from './csv'
import program from 'commander'
import {
  makeTransferMultiTx,
  signTransaction,
  execTransaction
} from './transactionSender'

program.version('v0.0.1')
program
  .option(
    '-f, --file <file>',
    'file to parse location, should be a CSV with "address,amount" format'
  )
  .option('-p, --privateKey <privateKey>', 'sender private key')
  .option('-a, --address <address>', 'sender address')
  .option('-t, --token <tokenContract>', 'token contract address')
  .parse(process.argv)

const paramsList = ['file', 'privateKey', 'address', 'token']

function main () {
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

  const txMulti = makeTransferMultiTx(
    program.token,
    program.address,
    csvContent
  )
  signTransaction(txMulti, program.privateKey)
  execTransaction(txMulti).then(result => {
    console.log('---- TRANSACTIONS DONE ----')
    console.log(JSON.stringify(result))
  })
}

main()
