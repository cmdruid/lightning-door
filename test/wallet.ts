export {}

fetch('http://localhost:3000/api/invoice').then(async res1 => {
  if (!res1.ok) {
    const { status, statusText } = res1
    const json = await res1.json()
    console.log(`Response 1 failed: ${status} ${statusText}`)
    console.log(json)
  } else {
    const { maxSendable } = await res1.json()
    console.log('Amount:', maxSendable)
    fetch(`http://localhost:3000/api/invoice?amount=${maxSendable}`).then(async res2 => {
      if (!res2.ok) {
        const { status, statusText } = res2
        const json = await res2.json()
        console.log(`Response 2 failed: ${status} ${statusText}`)
        console.log(json)
      } else {
        const { pr, successAction } = await res2.json()
        console.log('invoice:', pr)
        console.log('success:', successAction)
      }
    })
  }
})
