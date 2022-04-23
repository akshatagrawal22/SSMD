var identityCardContractAddress = '0x267EE4b8eC7357252B6b8A2E6A2481AB40Da5076';

if (window.ethereum) {
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
else if (window.web3) {
	window.web3 = new Web3(window.web3.currentProvider)
	// no need to ask for permission
}
else {
	window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
}
console.log(window.web3.currentProvider)

// Constants

//Variables 
var contract;
var account;
var newAccount;
var newIdCardAddress;
var newMedicalCardAddress;

//Web3 fucntions
web3.eth.getAccounts(function (err, accounts) {
	if (err != null) {
		alert("Error retrieving accounts.");
		return;
	}
	if (accounts.length == 0) {
		alert("No account found! Make sure the Ethereum client is configured properly.");
		return;
	}
	account = accounts[0];

	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);

	contract.methods.role(account).call(function (err, res) {
	if (res != 1) 
	{ 
		if(res==0)
		location.assign("hospital.html"); 
		else if(res==2)
		location.assign("patient.html"); 
		else
		location.assign("/login.html"); 
	}
	})
	document.getElementById('account-address').innerText = "Account Address : " + account;
	// document.getElementById('account-address').innerText = account;
	console.log('Account: ' + account);
	web3.eth.defaultAccount = account;
});

//role check

//loadPatientsofHospital();
//loadDoctorsofHospital();
//getMedicalDataAddress();

//Id Card Functions


function addMedicalData() {
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
	info = $("#add-Medical-data").val();
	contract.methods.addMedicalData(info).send({ from: account }).then(function (tx) {
		console.log("Transaction: ", tx);
	});
	$("#add-Medical-data").val('');
}

// var authPatientList = [];

// async function getAuthorizedPatientList() 
// {
// 	const contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
// 	contract.methods.loadPatients().call(function (err, res) {
// 		if (err) {
// 			console.log("An error occured", err)
// 			return
// 		}

// 		const fullPatientList = res;
// 		console.log(res);

// 		for (var i = 0; i < fullPatientList.length; i++) 
// 		{
// 			var patientAddress = fullPatientList[i];
// 			// console.log(patientAddress)
// 			// console.log(fullPatientList[i])
// 			// contract.methods.getMedicalDataAddress(patientAddress).call(function (err, res)
// 			contract.methods.getMedicalDataAddress(fullPatientList[i]).call(function (err, res)
// 			{
// 				console.log(fullPatientList[i])
// 				if (err) {
// 					console.log("An error occured", err)
// 					return
// 				}
// 				const medicalDataContractAddress = res;
// 				const medicalDataContract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
// 				medicalDataContract.methods.isAuthorized().call(function (err, res)
// 				{
// 					if (err) {
// 						console.log("An error occured", err)
// 						return
// 					}
// 					if (res == true)
// 					{
// 						console.log(res)
// 						console.log(patientAddress)
// 						authPatientList.push(patientAddress);
// 					}
// 				})

// 		})
// 		}
// 		// authPatientList.push('abcd');
// 	})
// }

function loadAuthorizedPatientList() 
{
	// authPatientList.push('1234');
	// console.log(authPatientList);
	// buildtable(authPatientList, 'authorizedPatients');
	$("#load-patients-of-doctor").css({"display": "none"});
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
	contract.methods.loadPatientsOfDoctor().call(function (err, res) 
	{
		if (err) {
		console.log("An error occured", err)
		return
		}
		console.log("The reply is: ", res)
		buildtable(res,'authorizedPatients');
	})
}

function requestNewPatient() 
{
	info = $("#request-New-Patient").val();
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
	contract.methods.getMedicalDataAddress(info).call(function (err, res) {
		if (err) {
			console.log("An error occured", err)
			return
		}
		console.log("Medical data add is : ", res);
		medicalDataContractAddress = res;
		medicalDataContract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
		medicalDataContract.methods.submitRequests().send({ from: account }).then(function (tx) {
			console.log("Transaction: ", tx);
		});
	})
	$("#request-New-Patient").val('');
}

function fetchMedicalData() 
{
	var medicalDataList;
	info = $("#get-Patient-Address").val();
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
	contract.methods.getMedicalDataAddress(info).call(function (err, res) 
	{
		if (err) {
			console.log("An error occured", err)
			return
		}
		console.log("Medical data add is : ", res);
		medicalDataContractAddress = res;
		medicalDataContract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
		medicalDataContract.methods.viewMedicalDataByDoctor().call(function (err, res) {
			if (err) {
				console.log("An error occured", err)
				return
			}
			console.log(res)
			medicalDataList = res;
			buildtable(medicalDataList, 'get-Medical-Data');
		})
	})
}

function addMedicalData() 
{
	info = $("#get-Patient-Address").val();
	medicalData = $("#add-medical-data").val();
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
	contract.methods.getMedicalDataAddress(info).call(function (err, res) 
	{
		if (err) {
			console.log("An error occured", err)
			return
		}
		console.log("Medical data add is : ", res);
		medicalDataContractAddress = res;
		medicalDataContract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
		medicalDataContract.methods.editMedicalData(medicalData).send( {from: account}).then( function(tx) { 
			console.log("Transaction: ", tx); 
	 });
	})
	$("#get-Patient-Address").val('');
	$("#add-medical-data").val('');
}

function buildtable(data, id) 
{
	
	console.log("Table called");
	console.log(data);

	var table = document.getElementById(id);

	table.style.display = 'inline-table';


	for (var i = 0; i < data.length; i++) {
		var row =
			` <tr>
		<td> ${i + 1}</td>
		<td style="text-align: center;"> ${data[i]}</td>
		</tr>`

		table.innerHTML += row;
	}

	table.innerHTML += `</table>`
}