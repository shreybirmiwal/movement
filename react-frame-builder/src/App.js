import React, { useEffect, useState } from 'react';
import { storage } from './firebase';
import { HexColorPicker } from "react-colorful";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import {ZeroDevSmartWalletConnectors} from "@dynamic-labs/ethereum-aa"
import {toBlob} from 'html-to-image';
import { saveAs } from 'file-saver';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';

function App() {
  
  const [movementTitle, setMovementTitle] = useState('');
  const [movementDescription, setMovementDescription] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#96b7ff');
  const [donationAddress, setDonationAddress] = useState('');

  const handleTitleChange = (e) => {
    setMovementTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setMovementDescription(e.target.value);
  };

  const handleDonationAddressChange = (e) => {
    setDonationAddress(e.target.value);
  };

  const handleConvertToImage = async () => {
    const divToConvert = document.getElementById('divToConvert');
    if (!divToConvert) return;

    let id;

    try {
      const blob = await toBlob(divToConvert, { pixelRatio: 2 });
      const storageRef = ref(storage);
      const listResult = await listAll(storageRef);
      const id = listResult.items.length + 1;
      const fileRef = ref(storage, id.toString());
      await uploadBytes(fileRef, blob);
      console.log('Uploaded a blob to Firebase Storage');
      const downloadURL = await getDownloadURL(fileRef);
      console.log('File download URL:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading blob to Firebase Storage:', error);
      return null;
    }

    return id;
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    // You can access the form values using the state variables
    console.log('Form submitted!');
    console.log('Movement Title:', movementTitle);
    console.log('Movement Description:', movementDescription);
    console.log('Background Color:', backgroundColor);
    console.log('Donation Address:', donationAddress);

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

    if (!(movementTitle && movementDescription && donationAddress)) {
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

    var returnID;

    handleConvertToImage().then(function(result){

      if(result == null){
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
        returnID = result;
      }

      console.log(result + "result") 
      return result;

    });



    
  };

  return (

    <DynamicContextProvider
    settings={{
      // Find your environment id at https://app.dynamic.xyz/dashboard/developer
      environmentId: '0ca24247-9679-4abc-8963-bb5f36ad358b',
      walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors],
    }}
    >
      <DynamicWagmiConnector>


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

            <input
              type="text"
              placeholder="What address should donations be sent to?"
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
              value={donationAddress}
              onChange={handleDonationAddressChange}
            />

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
            
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
              onClick={handleConvertToImage}
            >
              test button
            </button>

          </div>
        </div>




        <div className="flex w-1/2 justify-center items-center flex-col">
            
          <div>
            <div id="divToConvert" style={{backgroundColor: backgroundColor}} className={` w-[600px] h-[315px] rounded-md`}>
              <div className='text-center p-3'>
                <h1 className="text-3xl font-bold mt-10">{movementTitle || '[Title goes here]'}</h1>
                <h1 className="text-2xl mt-4">{movementDescription || '[Description goes here]'}</h1>
                <h1 className='mt-24'> People have joined this movement </h1>
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
    
    </DynamicWagmiConnector>
    </DynamicContextProvider>
  );
}

export default App;
