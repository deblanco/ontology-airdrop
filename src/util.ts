export function splitArrayIntoChunks (arr: any[], chunkLen: number) {
  let chunkList = []
  let chunkCount = Math.ceil(arr.length / chunkLen)
  for (let i = 0; i < chunkCount; i++) {
    chunkList.push(arr.splice(0, chunkLen))
  }
  return chunkList
}

export const sleep = (time: number) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve()
    }, time)
  )
