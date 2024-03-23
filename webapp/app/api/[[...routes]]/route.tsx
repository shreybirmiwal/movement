/** @jsxImportSource frog/jsx */
import { parseEther } from 'frog'
import { abi } from './abi'
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import {storage} from '../../firebase'
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'


app.frame('/page/:id', async (c) => {

  const { id } = c.req.param()
  console.log(id)

  var downloadURL = 'https://via.placeholder.com/150'
  
  if(id != null && id != undefined && id != '' && id != ':id'){
    const storageRef = ref(storage, id.toString());
    downloadURL = await getDownloadURL(storageRef);
  }

  var signers = 0;

  return c.res({
    action: '/finish',
    image: <img src={downloadURL} alt="Downloaded Image" />,
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

   return c.contract({
     abi,
     chainId: 'eip155:84532',
     functionName: '',
     to: ''
   })

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
