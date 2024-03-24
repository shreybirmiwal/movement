export const abi =[
	{
	  "type": "event",
	  "name": "petitioned",
	  "inputs": [
		{
		  "type": "address",
		  "name": "creator",
		  "indexed": false,
		  "internalType": "address"
		},
		{
		  "type": "string",
		  "name": "name",
		  "indexed": true,
		  "internalType": "string"
		},
		{
		  "type": "uint256",
		  "name": "id",
		  "indexed": true,
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "anonymous": false
	},
	{
	  "type": "function",
	  "name": "create",
	  "inputs": [
		{
		  "type": "string",
		  "name": "_name",
		  "internalType": "string"
		},
		{
		  "type": "string",
		  "name": "_pdfURI",
		  "internalType": "string"
		},
		{
		  "type": "string",
		  "name": "_imageURI",
		  "internalType": "string"
		},
		{
		  "type": "string",
		  "name": "_donation_address",
		  "internalType": "string"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "getDonationAddress",
	  "inputs": [
		{
		  "type": "uint256",
		  "name": "_id",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "type": "string",
		  "name": "",
		  "internalType": "string"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getImageURI",
	  "inputs": [
		{
		  "type": "uint256",
		  "name": "_id",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "type": "string",
		  "name": "",
		  "internalType": "string"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getPDFURI",
	  "inputs": [
		{
		  "type": "uint256",
		  "name": "_id",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "type": "string",
		  "name": "",
		  "internalType": "string"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getPetitions",
	  "inputs": [],
	  "outputs": [
		{
		  "type": "tuple[]",
		  "name": "",
		  "components": [
			{
			  "type": "uint256",
			  "name": "id",
			  "internalType": "uint256"
			},
			{
			  "type": "address",
			  "name": "creator",
			  "internalType": "address"
			},
			{
			  "type": "string",
			  "name": "name",
			  "internalType": "string"
			},
			{
			  "type": "string",
			  "name": "pdfURI",
			  "internalType": "string"
			},
			{
			  "type": "string",
			  "name": "imageURI",
			  "internalType": "string"
			},
			{
			  "type": "uint256",
			  "name": "funds",
			  "internalType": "uint256"
			},
			{
			  "type": "address[]",
			  "name": "donors",
			  "internalType": "address[]"
			},
			{
			  "type": "address[]",
			  "name": "signers",
			  "internalType": "address[]"
			},
			{
			  "type": "string",
			  "name": "donation_address",
			  "internalType": "string"
			}
		  ],
		  "internalType": "struct MovementStorage.Petition[]"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getTotalSigners",
	  "inputs": [
		{
		  "type": "uint256",
		  "name": "_id",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "type": "uint256",
		  "name": "",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "petitions",
	  "inputs": [
		{
		  "type": "uint256",
		  "name": "",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "type": "uint256",
		  "name": "id",
		  "internalType": "uint256"
		},
		{
		  "type": "address",
		  "name": "creator",
		  "internalType": "address"
		},
		{
		  "type": "string",
		  "name": "name",
		  "internalType": "string"
		},
		{
		  "type": "string",
		  "name": "pdfURI",
		  "internalType": "string"
		},
		{
		  "type": "string",
		  "name": "imageURI",
		  "internalType": "string"
		},
		{
		  "type": "uint256",
		  "name": "funds",
		  "internalType": "uint256"
		},
		{
		  "type": "string",
		  "name": "donation_address",
		  "internalType": "string"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "sign",
	  "inputs": [
		{
		  "type": "uint256",
		  "name": "_id",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	}
  ]