// Source code to interact with smart contract
//a
// web3 provider with fallback for old version
if (window.ethereum) 
{
  window.web3 = new Web3(window.ethereum)
  try {
      // ask user for permission
      ethereum.enable()
      // user approved permission
  } catch (error) {
      // user rejected permission
      console.log('user rejected permission')
  }
}
else if (window.web3) 
{
  window.web3 = new Web3(window.web3.currentProvider)
  // no need to ask for permission
}
else 
{
  window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
}
console.log (window.web3.currentProvider)

// contractAddress and abi are setted after contract deploy
var contractAddress = '0xc354127B1dD48213ef4AC33D1fdA1C8cb10c0493';
var abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "role",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "medicalData",
				"type": "address"
			}
		],
		"name": "updateMedicalData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "parentHospital",
				"type": "address"
			}
		],
		"name": "updateParentHospital",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewMedicalData",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewParentHospital",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

//contract instance
contract = new web3.eth.Contract(abi, contractAddress);

// Accounts
var account;

web3.eth.getAccounts(function(err, accounts) {
  if (err != null) {
    alert("Error retrieving accounts.");
    return;
  }
  if (accounts.length == 0) {
    alert("No account found! Make sure the Ethereum client is configured properly.");
    return;
  }
  account = accounts[0];
  console.log('Account: ' + account);
  web3.eth.defaultAccount = account;
});

//Smart contract functions
// function registerSetInfo() {
//   info = $("#newInfo").val();
//   contract.methods.setInfo (info).send( {from: account}).then( function(tx) { 
//     console.log("Transaction: ", tx); 
//   });
//   $("#newInfo").val('');
// }

// function registerGetInfo() {
//   contract.methods.getInfo().call().then( function( info ) { 
//     console.log("info: ", info);
//     document.getElementById('lastInfo').innerHTML = info;
//   });    
// }

function  getContractAddress() {
	//contractAddress;
	document.getElementById('lastInfo1').innerHTML = contractAddress;
}

function setContractAddress(){
	contractAddress = $("#newInfo1").val();
}

function updateParentHospital()
{
  info = $("#newInfo").val();
  contract.methods.updateParentHospital(info).send( {from: account}).then( function(tx) { 
         console.log("Transaction: ", tx); 
  });
  $("#newInfo").val('');
}

function viewParentHospital()
{
	contract.methods.viewParentHospital().call().then( function( info ) 
  { 
		    console.log("info: ", info);
		    document.getElementById('lastInfo').innerHTML = info;
		});   
}


// function updateParentHospital(address parentHospital) public {
//   require(_owner == msg.sender);
//   require(_role > 0);
//   _parentHospital = parentHospital;
// }






