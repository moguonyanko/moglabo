/**
 * @fileoverview WebAuthnのNPMパッケージ動作確認用スクリプト
 */

const secret = async () => {
  const res = await fetch('https://localhost/webxam/webauthn/secret')
  return await res.json()
}

const register = data => {
  fetch('https://localhost/webxam/webauthn/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('登録成功:', data)
  })
  .catch((error) => {
    console.error('エラー:', error)
  })
}

const main = async () => {
  console.log(await secret())
  
  const data = {
    username: 'Mike'
  }
  try {
    await register(data)
  } catch(err) {
    console.error(err)
  }
}

Promise.resolve(main())
