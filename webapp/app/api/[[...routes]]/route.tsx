/** @jsxImportSource frog/jsx */
import { parseEther } from 'frog'
import { abi } from './abi'
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  origin: 'https://4cfd-92-204-97-110.ngrok-free.app'
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'


app.frame('/page/:id', (c) => {

  const { id } = c.req.param()

  console.log(id)
  
  return c.res({
    action: '/finish',
    image: (<div>
      {id}
    </div>),
    intents: [
      <TextInput placeholder="Donate ETH" />,
      <Button.Transaction target="/Donate">Send Donation</Button.Transaction>,
      <Button.Transaction target="/Petition">Sign Petition (ethSign)</Button.Transaction>,
    ],
  })
  
})

app.transaction('/Donate', (c) => {
  // Contract transaction response.

  const { inputText } = c

  return c.send({
    chainId: 'eip155:10',
    to: '',
    value: parseEther(inputText),
  })

  // return c.contract({
  //   abi,
  //   chainId: 'eip155:84532',
  //   functionName: '',
  //   to: ''
  // })

})

app.transaction('/Petition', (c) => {
  // Contract transaction response.
  const { inputText } = c

  return c.contract({
    abi,
    chainId: 'eip155:84532',
    functionName: '',
    args: [inputText],
    to: ''
  })
})

app.frame('/finish', (c) => {
  const { transactionId } = c
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Transaction ID: {transactionId}
      </div>
    ),
    intents: [
      <Button.Reset>Restart</Button.Reset>,
    ],
  })
})


devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
