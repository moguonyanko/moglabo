self.onmessage = message => {
  const { array, limit } = message.data
 
  for (let i = 0; i < limit; i++) {
    array[0]++
  }

  self.postMessage(array)
}
