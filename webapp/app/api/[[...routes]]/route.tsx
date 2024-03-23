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

import { publicClient } from './client'
import { formatEther } from 'viem'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  origin: 'https://52c7-70-123-51-67.ngrok-free.app',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

const contractAdress = '0x5A9f1218BF93e7B3480fd226e3756C375FA34309'

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

function formatNumber(number: number): string {
  return number.toLocaleString();
}

async function getData(id: Number): Promise<{ totalDonors: any; downloadURL: string }> {

  const [totalDonors, URL] = await Promise.all([
    publicClient.readContract({
      address: contractAdress,
      abi: abi,
      functionName: 'getTotalDonors',
      args : [id]
    }),
    publicClient.readContract({
      address: contractAdress,
      abi: abi,
      functionName: 'getURI',
      args : [id]
    }),
  ]);

    const storageRef = ref(storage, URL);
    const downloadURL = await getDownloadURL(storageRef);

    return { totalDonors, downloadURL }
}


app.frame('/page/:id', async (c) => {

  const { id } = c.req.param()
  console.log("the id is " + id)

  var downloadURL = 'https://via.placeholder.com/150'
  var totalDonors = 0
  
  if(id != null && id != undefined && id != '' && id != ':id'){
    console.log("GETTING SM CONTRACT DATA !")
    const data = await getData(Number(id));
    totalDonors = data.totalDonors;
    downloadURL = data.downloadURL;
  }
  else {

    return c.res({
      image: './error.png',
      intents: [
        <Button.Reset>Reset</Button.Reset>,
      ],
    })
  
    }

  var signers = formatNumber(totalDonors);

  console.log(signers + " " + downloadURL)


  return c.res({
    action: '/finish',
    image: (
      <div
        style={{
          backgroundImage: `url(${downloadURL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat', // Prevent background image from repeating
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: '110px',
        }}
      >
        <div style={{ fontSize: 100, color:'black', display:'flex' }}>
          {signers.toString()}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Donate ETH" />,
      <Button.Transaction target={"/Donate/"+id}>Send Donation</Button.Transaction>,
      <Button.Link href="https://www.ethsign.xyz/">ethSign Petition</Button.Link>,
      <Button.Link href="http://localhost:3001/">Start your Movement</Button.Link>,
    ],
  })
  
})

app.transaction('/Donate/:id', (c) => {
  // Contract transaction response.
  const { id } = c.req.param()
  console.log(" in donate page, got ID " + id)
  const { inputText } = c
  console.log(" in donate page, got inputText " + inputText)
  const wei = BigInt(inputText || 0);

   return c.contract({
     abi,
     chainId: 'eip155:84532',
     functionName: 'donate',
     to: contractAdress,
     args: [id, BigInt(wei)] // Convert inputText to BigInt
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
