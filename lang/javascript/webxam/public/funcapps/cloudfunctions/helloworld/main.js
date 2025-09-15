const init = async () => {
  const url = 'https://localhost/mycloudfunctions/helloworld/'

  const response = await fetch(url)
  const output = document.querySelector('.output')
  try {
    output.textContent = await response.text()
  } catch (e) {
    output.textContent = `ERROR: ${e}`
  }
}

init().then()
