/** @jsxImportSource frog/jsx */
//test
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
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

const contractAdress = '0xA66C937bd67bAe0438B5ced58BE2c7BC8ADD170b'
// Uncomment to use Edge Runtime
// export const runtime = 'edge'

function formatNumber(number: number): string {
  return number.toLocaleString();
}

async function getData(id: Number): Promise<{ totalDonors: any; downloadURL: string, downloadPDF: string }> {

  const [totalDonors, URL, pdfURL] = await Promise.all([
    publicClient.readContract({
      address: contractAdress,
      abi: abi,
      functionName: 'getTotalSigners',
      args : [id]
    }),
    publicClient.readContract({
      address: contractAdress,
      abi: abi,
      functionName: 'getImageURI',
      args : [id]
    }),
    publicClient.readContract({
      address: contractAdress,
      abi: abi,
      functionName: 'getPDFURI',
      args : [id]
    }),

  ]);

    const url2: string = URL as string;
    const pdfURL2: string = pdfURL as string;

    //this is for the image
    const storageRef = ref(storage, url2);
    const downloadURL = await getDownloadURL(storageRef);

    //this is for the pdf
    const storageRef1 = ref(storage, pdfURL2);
    const downloadPDF = await getDownloadURL(storageRef1);

    return { totalDonors, downloadURL, downloadPDF }
}

async function getDonationAddy(id: Number): Promise<{ DonationAddress2: string }> {

  const [DonationAddress] = await Promise.all([
    publicClient.readContract({
      address: contractAdress,
      abi: abi,
      functionName: 'getDonationAddress',
      args : [id]
    })
  ]);

  return { DonationAddress2: DonationAddress as string };

}



app.frame('/', async (c) => {
  return c.res({
    action: '/page/1',
    image: (<div>
      
    </div>),
    intents: [
      <Button.Link href="http://localhost:3001/">Start your Movement</Button.Link>,
    ],
  })
})


app.frame('/page/:id', async (c) => {

  const { id } = c.req.param()
  //console.log("the id is " + id)

  var downloadURL = 'https://via.placeholder.com/150'
  var totalDonors = 0
  var pdfURL = 'https://via.placeholder.com/150'
  
  if(id != null && id != undefined && id != '' && id != ':id'){
    //console.log("GETTING SM CONTRACT DATA !")
    const data = await getData(Number(id));
    totalDonors = data.totalDonors;
    downloadURL = data.downloadURL;
    pdfURL = data.downloadPDF;
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
  //console.log(signers + " " + downloadURL)



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
        }}
      >
        <div style={{ fontSize: 100, color:'black', display:'flex', paddingBottom: '175px' }}>
          {signers.toString()}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Donate ETH" />,
      <Button.Transaction target={"/donate/"+id}>Donate</Button.Transaction>,
      <Button.Transaction target={"/sign/"+id}>Sign</Button.Transaction>,
     // <Button.Transaction target={"/send-ether/"}>send ether</Button.Transaction>,
      <Button.Link href={pdfURL}>View</Button.Link>,
      <Button.Link href="https://frame-builder.vercel.app/">Start your Movement</Button.Link>,
    ],
  })
  
})


app.transaction('/donate/:id', async (c)  => {

  const { id } = c.req.param()
  const { inputText } = c
  console.log(" in donate page, got ID " + id)
  console.log(" in donate page, got inputText " + inputText)
  console.log(" in donate page, got PARSED INPUT TEXT " + parseEther(inputText ?? ''))

  const data = await getDonationAddy(Number(id));
  var DONNYADDY = data.DonationAddress2 as `0x${string}`

  console.log(" DONATION ADDY " + DONNYADDY)

  return c.send({
    chainId: 'eip155:84532',
    to: data.DonationAddress2 as `0x${string}`,
    value: parseEther(inputText ?? '')
  })

  //  return c.contract({
  //    abi,
  //    chainId: 'eip155:84532',
  //    functionName: 'donate',
  //    to: contractAdress,
  //    args: [Number(id)] // Convert inputText to BigInt
  //  })
  
  // return c.send({
  //   chainId: 'eip155:84532',
  //   to: '0x9A0E9b21A73a9F6329f7Ebb07cc019947A84112B',
  //   value: parseEther(inputText ?? '')
  // })

})

app.transaction('/send-ether', (c) => {
  const { inputText } = c
  // Send transaction response.
  return c.send({
    chainId: 'eip155:84532',
    to: '0x86E0fDd31124a126FFFc8A160FD580C94377E35e',
    value: parseEther(inputText ?? '')
  })
})

app.transaction('/sign/:id', (c) => {
  // Contract transaction response.
  const { id } = c.req.param()
  //console.log(" in sign page, got ID " + id)
   return c.contract({
     abi,
     chainId: 'eip155:84532',
     functionName: 'sign',
     to: contractAdress,
     args: [Number(id)] 
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