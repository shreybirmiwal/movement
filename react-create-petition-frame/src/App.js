import React, { useState } from 'react';
import { HexColorPicker } from "react-colorful";
import './app.css'

function App() {
  const [movementTitle, setMovementTitle] = useState('');
  const [movementDescription, setMovementDescription] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
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

  const handleSubmit = () => {
    // Handle form submission logic here
    // You can access the form values using the state variables
    console.log('Form submitted!');
    console.log('Movement Title:', movementTitle);
    console.log('Movement Description:', movementDescription);
    console.log('Background Color:', backgroundColor);
    console.log('Donation Address:', donationAddress);
  };

  return (
    <div className="flex h-screen">

      <div className="flex w-1/2 justify-center items-center flex-col">
        <h1 className="text-3xl font-bold mb-4">Create a Movement </h1>

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
        </div>
      </div>





      <div className="flex w-1/2 justify-center items-center flex-col">
        <h1 className="text-3xl font-bold mb-4">Preview your Movement </h1>
          
        <div style={{backgroundColor: backgroundColor}} className={` w-[600px] h-[315px] rounded-md`}>

          <div className='text-center'>
            <h1 className="text-3xl font-bold mt-4">{movementTitle || '[Title goes here]'}</h1>
            <h1 className="text-2xl mt-4">{movementDescription || '[Description goes here]'}</h1>
          </div>


            <h1> 0 people have signed </h1>
            <p> </p>
            test
        </div>

      </div>


    </div>
  );
}

export default App;
