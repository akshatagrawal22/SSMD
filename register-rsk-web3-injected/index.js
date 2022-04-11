// Source code to interact with smart contract
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
var identityCardContractAddress = '0x267EE4b8eC7357252B6b8A2E6A2481AB40Da5076';
var medicalDataContractAddress = '0x267EE4b8eC7357252B6b8A2E6A2481AB40Da5076';
var centralDatabaseContractAddress = '0x267EE4b8eC7357252B6b8A2E6A2481AB40Da5076';


var abiIdentityCard = [
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

var abiMedicalData = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "centralDatabase",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_msg",
				"type": "address"
			}
		],
		"name": "addDoctorByHospital",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_msg",
				"type": "address"
			}
		],
		"name": "addDoctorByPatient",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_msg",
				"type": "address"
			}
		],
		"name": "addHospitalByHospital",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_msg",
				"type": "address"
			}
		],
		"name": "addHospitalByPatient",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_msg",
				"type": "string"
			}
		],
		"name": "addMedicalData",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isAuthorized",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isNotOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_msg",
				"type": "address"
			}
		],
		"name": "removeDoctor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

var abiCenteralDatabase = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "isDoctor",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "isHospital",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "isPatient",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "identityCardAddress",
				"type": "address"
			}
		],
		"name": "updateDoctor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "identityCardAddress",
				"type": "address"
			}
		],
		"name": "updateHospital",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "identityCardAddress",
				"type": "address"
			}
		],
		"name": "updatePatient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];



//contract instance
var contract;// = new web3.eth.Contract(abi, contractAddress);

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

function fetchAccount(){
	//identityCardContractAddress = $("#newInfo1").val();
	//$("#newInfo1").val('');
	//web3.getAccounts();
	document.getElementById('signed-in-account').innerHTML =account;
}



function setContractAddress(){
	identityCardContractAddress = $("#newInfo1").val();
	$("#newInfo1").val('');
	document.getElementById('lastInfo1').innerHTML =identityCardContractAddress;
}

function updateParentHospitalAddress()
{
	contract = new web3.eth.Contract(abiIdentityCard, identityCardContractAddress);
  	info = $("#newInfo").val();
  	contract.methods.updateParentHospital(info).send( {from: account}).then( function(tx) { 
         console.log("Transaction: ", tx); 
  });
  $("#newInfo").val('');
}

function viewParentHospitalAddress()
{
	contract = new web3.eth.Contract(abiIdentityCard, identityCardContractAddress);
  	contract.methods.viewParentHospital().call(function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("The reply is: ", res)
		document.getElementById('lastInfo').innerHTML = res;
	  })
}

function updateMedicalDataAddress()
{
	contract = new web3.eth.Contract(abiIdentityCard, identityCardContractAddress);
  	info = $("#newInfo2").val();
  	contract.methods.updateMedicalData(info).send( {from: account}).then( function(tx) { 
         console.log("Transaction: ", tx); 
  });
  $("#newInfo2").val('');
}

function viewMedicalDataAddress()
{
	contract = new web3.eth.Contract(abiIdentityCard, identityCardContractAddress);
  	contract.methods.viewMedicalData().call(function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("The reply is: ", res)
		document.getElementById('lastInfo2').innerHTML = res;
	  })
}




///////////////////////////////////Medical Data Interaction

function setContractAddress2(){
	medicalDataContractAddress = $("#medical-data-address").val();
	$("#medical-data-address").val('');
	document.getElementById('get-medical-data-address').innerHTML = medicalDataContractAddress;
}

function removeDoctor()
{
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
  info = $("#remove-doctor").val();
  contract.methods.removeDoctor(info).send( {from: account}).then( function(tx) { 
         console.log("Transaction: ", tx); 
  });
  $("#remove-doctor").val('');
}


function addMedicalData()
{
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
  info = $("#add-Medical-data").val();
  contract.methods.addMedicalData(info).send( {from: account}).then( function(tx) { 
         console.log("Transaction: ", tx); 
  });
  $("#add-Medical-data").val('');
}

function addHospitalByHospital()
{
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
  info = $("#add-Hospital-By-Hospital").val();
  contract.methods.addHospitalByHospital(info).send( {from: account}).then( function(tx) { 
         console.log("Transaction: ", tx); 
  });
  $("#add-Hospital-By-Hospital").val('');
}

function addHospitalByPatient()
{
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
  info = $("#add-Hospital-By-Patient").val();
  contract.methods.addHospitalByPatient(info).send( {from: account}).then( function(tx) { 
         console.log("Transaction: ", tx); 
  });
  $("#add-Hospital-By-Patient").val('');
}

function addDoctorByHospital()
{
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
  info = $("#add-Doctor-By-Hospital").val();
  contract.methods.addDoctorByHospital(info).send( {from: account}).then( function(tx) { 
         console.log("Transaction: ", tx); 
  });
  $("#add-Doctor-By-Hospital").val('');
}

function addDoctorByPatient()
{
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
  info = $("#add-Doctor-By-Patient").val();
  contract.methods.addDoctorByPatient(info).send( {from: account}).then( function(tx) { 
         console.log("Transaction: ", tx); 
  });
  $("#add-Doctor-By-Patient").val('');
}

function updateParentHospital()
{
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
  info = $("#update-Parent-Hospital").val();
  contract.methods.addDoctorByPatient(info).send( {from: account}).then( function(tx) { 
         console.log("Transaction: ", tx); 
  });
  $("#update-Parent-Hospital").val('');
}




//////////////Central Database 


function setCentralDatabaseAddress(){
	centralDatabaseContractAddress = $("#central-database-address").val();
	$("#central-database-address").val('');
	document.getElementById('get-central-database-address').innerHTML = centralDatabaseContractAddress;
}



function updateDoctor()
{
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
  	doctorAddress = $("#central-database-doctor-address").val();
  	identityAddress = $("#central-database-doctor-identity-address").val();
	console.log(doctorAddress);
	console.log(identityAddress);
	contract.methods.updateDoctor(doctorAddress,identityAddress).send( {from: account}).then( function(tx) { 
			console.log("Transaction: ", tx); 
	});
	$("#central-database-doctor-address").val('');
	$("#central-database-doctor-identity-address").val('');
}


function updateHospital()
{
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
  	hospitalAddress = $("#central-database-hospital-address").val();
  	identityAddress = $("#central-database-hospital-identity-address").val();
  
	contract.methods.updateHospital(hospitalAddress,identityAddress).send( {from: account}).then( function(tx) { 
			console.log("Transaction: ", tx); 
	});
	$("#central-database-hospital-address").val('');
	$("#central-database-hospital-identity-address").val('');
}

function updatePatient()
{
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
  	patientAddress = $("#central-database-patient-address").val();
  	identityAddress = $("#central-database-patient-identity-address").val();
  
	contract.methods.updatePatient(patientAddress,identityAddress).send( {from: account}).then( function(tx) { 
			console.log("Transaction: ", tx); 
	});
	$("#central-database-patient-address").val('');
	$("#central-database-patient-identity-address").val('');
}



function isPatient()
{
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
  	patientAddress = $("#central-database-is-patient-address").val();
  	console.log(patientAddress);
	  contract.methods.isPatient(patientAddress).call(function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("The reply is: ", res)
		document.getElementById('get-central-database-is-patient-address').innerHTML = res;
	  })
	$("#central-database-is-patient-address").val('');
	
	
}



function isDoctor()
{
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
  	doctorAddress = $("#central-database-is-doctor-address").val();
  	console.log(doctorAddress);
	  contract.methods.isDoctor(doctorAddress).call(function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("The reply is: ", res)
		document.getElementById('get-central-database-is-doctor-address').innerHTML = res;
	  })
	$("#central-database-is-doctor-address").val('');
	
	
}



function isHospital()
{
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
  	hospitalAddress = $("#central-database-is-hospital-address").val();
  	console.log(hospitalAddress);
	  contract.methods.isHospital(hospitalAddress).call(function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("The reply is: ", res)
		document.getElementById('get-central-database-is-hospital-address').innerHTML = res;
	  })
	$("#central-database-is-hospital-address").val('');
	
	
}