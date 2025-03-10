onmessage = async event => {
  const message = event.data
  console.log(message)
  const handle = await navigator.storage.getDirectory() 
  const fileName = 'samplememo.txt'
  const fileHandle = await handle.getFileHandle(fileName, {
    create: true
  })
  // createSyncAccessHandleはWebWorker内でしか使用できない。
  const accessHandle = await fileHandle.createSyncAccessHandle()
  const buffer = new DataView(new ArrayBuffer(accessHandle.getSize()))
  const readBuffer = accessHandle.read(buffer, { at: 0 })
  const encoder = new TextEncoder()
  const encodedMessage = encoder.encode(message)
  const writeBuffer = accessHandle.write(encodedMessage, { at: readBuffer })  
  console.log(writeBuffer)  

  accessHandle.flush()
  accessHandle.close()

  self.postMessage({
    fileName,
    size: writeBuffer
  })
}
