import React, { useEffect, useState } from 'react';
import { storage } from './firebase';
import { HexColorPicker } from "react-colorful";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAccount, useNetwork } from 'wagmi';
import {abi} from './abi.js'
import {toBlob} from 'html-to-image';
import { saveAs } from 'file-saver';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';

import {useContractEvent} from 'wagmi'
import { useContractWrite } from 'wagmi' 
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
 
function App() {

  const { address, isConnected } = useAccount();

  const contractAdress = '0xbDC0037b94320953B2CF3B4c724ffc7748345A7d'

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: contractAdress,
    abi: abi,
    functionName: 'create',
  })
  const [movementTitle, setMovementTitle] = useState('');
  const [movementDescription, setMovementDescription] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#96b7ff');
  const [selectedPDF, setSelectedPDF] = useState(null);

  const handleTitleChange = (e) => {
    setMovementTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setMovementDescription(e.target.value);
  };



  //    event petitioned(address creator, string indexed name, uint256 indexed id);


  useContractEvent({
    address: contractAdress,
    abi: abi,
    eventName: 'petitioned', 
    listener(log) {
      console.log("HI GUYS WE JUST GOT A USE CONTRACT EVENT EMISSION!", JSON.stringify(log));
      const { args: { id } } = log[0];

      const { args: { creator } } = log[0];

      console.log("Creator:", creator);
      console.log("Address:", address)

      //if(creator == address){
        console.log("ID:", id);
        confirmAlert({
          title: 'Your Movement has been created!',
          message: ('https://movement-iota.vercel.app/api/page/'+ id.toString()),
          buttons: [
            {
              label: 'Yes',
              onClick: () => alert('Comfirm you have saved the URL')
            },
          ],
          closeOnEscape: true,
          closeOnClickOutside: true,
          keyCodeForClose: [8, 32],
          willUnmount: () => {},
          afterClose: () => {},
          onClickOutside: () => {},
          onKeypress: () => {},
          onKeypressEscape: () => {},
          overlayClassName: "overlay-custom-class-name"
        })
  //    }
   //   else {
  //      console.log("Emisson that isnt mine ")
  //    }

    },
  })

  const handleConvertToImage = async () => {
    const divToConvert = document.getElementById('divToConvert');
    if (!divToConvert) return;

    let downloadURL;
    let pdfUrl;

    try {
      const blob = await toBlob(divToConvert, { pixelRatio: 2 });
      const storageRef = ref(storage);
      const listResult = await listAll(storageRef);
      const id = listResult.items.length + 1;
      const fileRef = ref(storage, id.toString());
      await uploadBytes(fileRef, blob);
      console.log('Uploaded a blob to Firebase Storage');
      downloadURL = await getDownloadURL(fileRef);
      console.log('Download URL:', downloadURL);

      //also uploda the pdf
      console.log("THIS IS !!! " + selectedPDF.name);
      const fileRef2 = ref(storage, selectedPDF.name); 
      await uploadBytes(fileRef2, selectedPDF[0]);
      pdfUrl = await getDownloadURL(fileRef2);

    } catch (error) {
      console.error('Error uploading blob to Firebase Storage:', error);
      return null;
    }

    return {downloadURL, pdfUrl};
  };

  const handlePDFUpload = (event) => {
    const file = event.target.files[0];
    setSelectedPDF(file);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    // You can access the form values using the state variables
    console.log('Form submitted!');
    console.log('Movement Title:', movementTitle);
    console.log('Movement Description:', movementDescription);
    console.log('Background Color:', backgroundColor);

    // if(!isConnected){
    //   toast.error('Ensure wallet is connected!', {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "dark",
    //   });
    // }

    if (!(movementTitle && movementDescription && selectedPDF )) {
      toast.error('Ensure fields not left blank!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    console.log('About to convert to image...')

    handleConvertToImage().then(function({downloadURL, pdfUrl}){

      if(downloadURL == null || pdfUrl == null){
        toast.error('Error uploading Movement!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }
      else {
        console.log(" ABOUT TO WRITE TO CONTRACT .. ")

        write({
          args: [movementTitle, pdfUrl, downloadURL],
          onError(error) {
            console.log('Error', error)
          },
          onSuccess(data) {
            console.log('Success', data)
          },
        })

        if(isSuccess){
          console.log("SUCCESS")
          console.log(JSON.stringify(data))
        }
        console.log("ADDED SMART CONTRACT ")

      }

      //console.log(result + "result") 
      //return result;
      return;

    });
    
  };

  return (

    <div>
      <div className='p-10'>
        <DynamicWidget />
      </div>

    <div>

      {/*TIT:E */}
      <div className="flex mt-10">
        <div className="flex w-1/2 justify-center items-center flex-col">
          <h1 className="text-3xl font-bold mb-4">Create a Movement </h1>
        </div>
        <div className="flex w-1/2 justify-center items-center flex-col">
          <h1 className="text-3xl font-bold mb-4">Preview your Movement</h1>
        </div>
      </div>

      <div className="flex">
        <div className="flex w-1/2 justify-center items-center flex-col">
          <div className="max-w-md p-8 bg-white rounded shadow-2xl">
            <input
              type="text"
              placeholder="What's this movement about?"
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
              value={movementTitle}
              onChange={handleTitleChange}
            />

            <input
              type="text"
              placeholder="Description of your movement"
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
              value={movementDescription}
              onChange={handleDescriptionChange}
            />


            <h1 className='text-gray-400'> Frame Background Color: ({backgroundColor})</h1>
            <div className='flex justify-center mt-5'>
              <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} className='mb-4 w-32' />
            </div>

            {/* <input
              type="text"
              placeholder="What address should donations be sent to?"
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
              value={donationAddress}
              onChange={handleDonationAddressChange}
            /> */}
            
            <h1 className='text-gray-400'> Where can signers learn about what they are signing?</h1>
            <input
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full mt-4"
              type="file"
              accept=".pdf"
              onChange={handlePDFUpload}
              placeholder='Upload Contract PDF'
            />


            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
            

          </div>
        </div>



        <div className="flex w-1/2 justify-center items-center flex-col">
            
          <div>
            <div id="divToConvert" style={{backgroundColor: backgroundColor}} className={` w-[600px] h-[315px] rounded-md`}>
              <div className='text-center p-3'>
                <h1 className="text-3xl font-bold mt-10">{movementTitle || '[Title goes here]'}</h1>
                <h1 className="text-2xl mt-4">{movementDescription || '[Description goes here]'}</h1>
                <h1 className='mt-32'> People have joined this movement </h1>
              </div>
            </div>
            <div className='bg-gray-100 h-[122px]'>

              <div className='py-5 border'>
                <div className='ml-5 text-gray-500'>
                  Donate ETH
                </div>
              </div>

                <div className="grid grid-cols-3 text-center">
                    <div className='grid-span-1 border py-4'>
                      Send Donation
                    </div>
                    <div className='grid-span-1 border py-4'>
                      EthSign Petition
                    </div>
                    <div className='grid-span-1 border py-4'>
                      Create your Movement ->
                    </div>
                  </div>
              </div>


          </div>

        </div>


      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"r
      />

    </div>
    </div>

  );
}

export default App;