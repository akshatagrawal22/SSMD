
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

// Constants

//Variables 
var contract;
var account;
var newAccount;
var newIdCardAddress;
var newMedicalCardAddress;

//Web3 fucntions
// "account-address"
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

  contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);

  contract.methods.role(account).call(function (err, res) {
	if (res != 0) 
	{ 
	  if(res==2)
		location.assign("patient.html"); 
	  else if(res==1)
		location.assign("doctor.html"); 
	  else
		location.assign("/login.html"); 
	}
	})
document.getElementById('account-address').innerText = "Account Address : " + account;
  console.log('Account: ' + account);
  web3.eth.defaultAccount = account;
});




function addHospitalByHospital()
{
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
  info = $("#add-Hospital-By-Hospital").val();
  contract.methods.addHospitalByHospital(info).send( {from: account}).then( function(tx) { 
         console.log("Transaction: ", tx); 
  });
  $("#add-Hospital-By-Hospital").val('');
}


function loadDoctorsofHospital()
{
	//$("#load-doctors-of-hospital").css({"display": "none"});
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
  	contract.methods.loadDoctorsOfHospital().call(function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("The reply is: ", res)
		buildtable(res,'doctors-of-hospital');

	  })
}


function loadPatientsofHospital()
{
	//$("#load-patients-of-hospital").css({"display": "none"});
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
  	contract.methods.loadPatientsOfHospital().call(function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("The reply is: ", res)
		//document.getElementById('patients-of-hospital').innerHTML = res;
        buildtable(res,'patients-of-hospital');
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


//Creating Doctor and Patient


function updateDoctorInDatabase()
{
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
	contract.methods.updateDoctor(newAccount.address).send( {from: account}).then( function(tx) { 
			console.log("Transaction: ", tx); 
	});
}

function updatePatientInDatabase()
{
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
	contract.methods.updatePatient(newAccount.address,newMedicalCardAddress).send( {from: account}).then( function(tx) { 
			console.log("Transaction: ", tx); 
	});
}

async function  createMedicalData(){

	
	var deployingContract = new web3.eth.Contract(abiMedicalData).deploy({
		data: bytecodeMedicalData,
		arguments: [centralDatabaseContractAddress,newAccount.address]
	});
	console.log(deployingContract);
	var estimateGas = await deployingContract.estimateGas();
	var deployedContract = await deployingContract.send({
	from: account,
	gas: estimateGas
	})

	console.log('Address of Medical Data contract' + deployedContract.options.address);
	newMedicalCardAddress = deployedContract.options.address;
};


async function createAccountandTransaction()
{

	newAccount = await web3.eth.accounts.create();;
	console.log("New Account is :", newAccount);

	const amount = 2; // Willing to send 2 ethers
	const amountToSend = web3.utils.toWei(String(amount), "ether"); // Convert to wei value
	var send = web3.eth.sendTransaction({ from: account, to: newAccount.address, value: amountToSend });
	await web3.eth.getBalance(account, (err, bal) => { console.log("Ganache balance", bal); } );

}



async function createDoctor()
{
	await createAccountandTransaction();
	//await createIdCard(1);
	await updateDoctorInDatabase();
	document.getElementById('new-doctor-account-details').innerText = "New Account Address: "+JSON.stringify(newAccount.address) + "\n" + "Private Key : " +JSON.stringify(newAccount.privateKey); 
}

async function createPatient()
{
	await createAccountandTransaction();
	//await createIdCard(2);
	await createMedicalData();
	await updatePatientInDatabase();
	document.getElementById('new-patient-account-details').innerText = "New Account Address: "+JSON.stringify(newAccount.address) + "\n" + "Private Key : " +JSON.stringify(newAccount.privateKey) + "\n" + "Address of Medical - Data Card : "+ JSON.stringify(newMedicalCardAddress) ; 
}

function buildtable(data,id){


	console.log("Table callled");

	var table = document.getElementById(id);
		
	table.style.display = 'inline-table';
	table.innerHTML="";

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