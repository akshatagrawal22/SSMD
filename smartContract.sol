// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0;

     contract CentralDatabase {

        mapping(address => address) private parentHospitalMap;  
        mapping(address => uint) private hospital;
        mapping(address => uint) private patient;
        mapping(address => uint) private doctor;
        address[] private hospitalsArray;
        address[] private doctorsArray;
        address[] private patientsArray;
        address private _owner;
        mapping(address => address[]) private doctorsOfHospital;
        mapping(address => address[]) private patientsOfHospital;
        mapping(address => address[]) private patientsOfDoctor;
        mapping(address => address) private medicalDataOfPatients;

        
        constructor() 
        {
            _owner = msg.sender;
        }

        function role(address userAddress) public view returns(int)
         {
            if(hospital[userAddress]==1)
                return 0;
            if(doctor[userAddress]==1)
                return 1;
            if(patient[userAddress]==1)
                return 2;
            else 
                return -1;   
        }

        function updateHospital(address userAddress ) public 
        {
            require(_owner == msg.sender);
            require(role(userAddress) == -1);
                
            hospital[userAddress] = 1;
            parentHospitalMap[userAddress] = msg.sender;
            hospitalsArray.push(userAddress);
        }

        function updateDoctor(address userAddress) public {
            
            require(hospital[msg.sender]==1);
            require(role(userAddress) == -1);
                
            doctor[userAddress] = 1;
            parentHospitalMap[userAddress] = msg.sender;
            doctorsArray.push(userAddress);
            doctorsOfHospital[msg.sender].push(userAddress);

        }
        
        function updatePatient(address userAddress ,address medicalDataAddress) public {
            require(hospital[msg.sender]==1);
            require(role(userAddress) == -1);
              
            patient[userAddress] = 1;
            parentHospitalMap[userAddress] = msg.sender;
            patientsArray.push(userAddress);
            patientsOfHospital[msg.sender].push(userAddress);
            medicalDataOfPatients[userAddress]=medicalDataAddress;
        }

        function addToPatientsOfDoctor(address userAddress) public 
        {
            require(patient[msg.sender]==1);
            require(doctor[userAddress]==1);

            patientsOfDoctor[userAddress].push(msg.sender);
        }

        function addToPatientsOfHospital(address userAddress) public 
        {
            require(patient[msg.sender]==1);
            require(hospital[userAddress]==1);

            patientsOfHospital[userAddress].push(msg.sender);
        }

        function deleteHospitalFromPatient(address userAddress) public 
        {
            require(patient[msg.sender]==1);
            require(hospital[userAddress]==1);

            address[] memory patient_array = patientsOfHospital[userAddress];

            uint ind = 0;
            for(uint i=0;i<patient_array.length ;i++)
            {
                if(patient_array[i] == msg.sender)
                    ind=i+1;
            }
            if(ind>0 && ind <= patientsOfHospital[userAddress].length)
            {
                ind = ind - 1;
                for (uint i = ind; i<patientsOfHospital[userAddress].length-1; i++)
                {
                    patientsOfHospital[userAddress][i] = patientsOfHospital[userAddress][i+1];
                }
                patientsOfHospital[userAddress].pop();
            }
            for(uint i=0;i<doctorsOfHospital[userAddress].length ;i++)
            {
                 deleteDoctorFromPatient(doctorsOfHospital[userAddress][i]);
            }
        }

        function deleteDoctorFromPatient(address userAddress) public 
        {
            require(patient[msg.sender]==1);
            require(doctor[userAddress]==1);

            address[] memory patient_array = patientsOfDoctor[userAddress];

            uint ind = 0;
            for(uint i=0;i<patient_array.length ;i++)
            {
                if(patient_array[i] == msg.sender)
                    ind=i+1;
            }
            if(ind>0 && ind <= patientsOfDoctor[userAddress].length)
            {
                ind = ind - 1;
                for (uint i = ind; i<patientsOfDoctor[userAddress].length-1; i++)
                {
                    patientsOfDoctor[userAddress][i] = patientsOfDoctor[userAddress][i+1];
                }
                patientsOfDoctor[userAddress].pop();
            }
        }

        function updateMedicalDataAddress(address userAddress) public{
            medicalDataOfPatients[msg.sender]=userAddress;
        }


        function isDoctor(address userAddress) public view returns(bool) {
            return doctor[userAddress]==1;
        }
        function isPatient(address userAddress) public view returns(bool) {
            return patient[userAddress]==1;
        }
        function isHospital(address userAddress) public view returns(bool) {
            return hospital[userAddress]==1;
        }

        
        function getParentHospital(address userAddress) public view returns(address){ return parentHospitalMap[userAddress]; }
        function loadDoctors() public view returns(address [] memory){ return doctorsArray; }
        function loadHospitals() public view returns(address [] memory){ return hospitalsArray; }
        function loadPatients() public view returns(address [] memory){ return patientsArray; }
        function loadPatientsOfHospital() public view returns(address [] memory){ return patientsOfHospital[msg.sender]; }
        function loadPatientsOfDoctor() public view returns(address [] memory){ return patientsOfDoctor[msg.sender]; }
        function loadDoctorsOfHospital() public view returns(address [] memory){ return doctorsOfHospital[msg.sender]; }
        function getMedicalDataAddress(address userAddress) public view returns(address){ return medicalDataOfPatients[userAddress]; }
        


    }


    contract UserMedicalData{ 
        string [] private medicalData;

        mapping(address => uint) private hospitalMap;
        mapping(address => uint) private doctorMap;
        address[] private authorisedDoctorsArray ;
        address[] private authorisedHospitalsArray ;
        
        address private _owner;
        
        address _centralDatabase;

        address [] private requests;

        constructor(address centralDatabase, address userAddress){
            _owner = userAddress;
            _centralDatabase = centralDatabase;
            authorisedHospitalsArray.push(msg.sender);
            hospitalMap[msg.sender]=1;
        }


        modifier onlyOwner() {
            require(isOwner(),
            "Function accessible only by the Owner!!");
            _;
        }
        function isOwner() public view returns(bool) {
            return _owner==msg.sender;
        }

        function isNotOwner() public view returns(bool) {
            return _owner!=msg.sender;
        }

        modifier onlyAuthorized() {
            require(isAuthorized(),
            "Function accessible only by the authorised doctor!!");
            _;
        }

        function isAuthorized() public view returns(bool) {
            if(doctorMap[msg.sender]==1) return true;
            if(hospitalMap[msg.sender]==1) return true;
            return false;
        }

        function toAsciiString(address x) internal pure returns (string memory) {
            bytes memory s = new bytes(40);
            for (uint i = 0; i < 20; i++) {
                bytes1 b = bytes1(uint8(uint(uint160(x)) / (2*(8*(19 - i)))));
                bytes1 hi = bytes1(uint8(b) / 16);
                bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
                s[2*i] = char(hi);
                s[2*i+1] = char(lo);            
            }
            return string(s);
        }

        function char(bytes1 b) internal pure returns (bytes1 c) {
            if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
            else return bytes1(uint8(b) + 0x57);
        }

        function uint2str(uint256 _i)internal pure returns (string memory str){
            if (_i == 0)
            {
                return "0";
            }
            uint256 j = _i;
            uint256 length;
            while (j != 0)
            {
                length++;
                j /= 10;
            }
            bytes memory bstr = new bytes(length);
            uint256 k = length;
            j = _i;
            while (j != 0)
            {
                bstr[--k] = bytes1(uint8(48 + j % 10));
                j /= 10;
            }
            str = string(bstr);
        }

       

        
        function removeDoctorByPatient(address userAddress) onlyOwner public 
        {
                // patient can remove any doctor
                require(_owner == msg.sender);
                require(doctorMap[userAddress] == 1);
                uint ind = 0;
                for(uint i=0;i<authorisedDoctorsArray.length ;i++)
                {
                    if(authorisedDoctorsArray[i] == userAddress)
                        ind=i+1;
                }

                if(ind>0 && ind <= authorisedDoctorsArray.length)
                {
                    ind = ind - 1;
                    for (uint i = ind; i<authorisedDoctorsArray.length-1; i++)
                    {
                        authorisedDoctorsArray[i] = authorisedDoctorsArray[i+1];
                    }
                    authorisedDoctorsArray.pop();
                }
                doctorMap[userAddress] = 0;
        }

        function removeDoctorByHospital(address userAddress) onlyOwner public 
        {
                // hospital can only remove doctors its authorised to remove
                require(doctorMap[userAddress] == 1);
                CentralDatabase centralDatabase = CentralDatabase(_centralDatabase);
                require(centralDatabase.getParentHospital(userAddress) ==  msg.sender);

                uint ind = 0;
                for(uint i=0;i<authorisedDoctorsArray.length ;i++)
                {
                    if(authorisedDoctorsArray[i] == userAddress)
                        ind=i+1;
                }

                if(ind>0 && ind <= authorisedDoctorsArray.length)
                {
                    ind = ind - 1;
                    for (uint i = ind; i<authorisedDoctorsArray.length-1; i++)
                    {
                        authorisedDoctorsArray[i] = authorisedDoctorsArray[i+1];
                    }
                    authorisedDoctorsArray.pop();
                }

                doctorMap[userAddress] = 0;                
        }

        
        function removeHospitalByPatient(address userAddress) onlyOwner public 
        {
                //patient can remove any hospital and doctor associated with it got removed 
                require(_owner == msg.sender);
                CentralDatabase centralDatabase = CentralDatabase(_centralDatabase);
                
                require(hospitalMap[userAddress] == 1);
                uint ind = 0;
                for(uint i=0;i<authorisedHospitalsArray.length ;i++)
                {
                    if(authorisedHospitalsArray[i] == userAddress)
                        ind=i+1;
                }
                if(centralDatabase.getParentHospital(msg.sender)!=userAddress)
                {
                    if(ind>0 && ind <= authorisedHospitalsArray.length)
                    {
                        ind = ind - 1;
                        for (uint i = ind; i<authorisedHospitalsArray.length-1; i++)
                        {
                            authorisedHospitalsArray[i] = authorisedHospitalsArray[i+1];
                        }
                        authorisedHospitalsArray.pop();
                    }

                    hospitalMap[userAddress] = 0;
                }
                ind = 0;
                
                uint a =0;
                for(uint index=0;index<authorisedDoctorsArray.length;index++)
                {
                    if(centralDatabase.getParentHospital(authorisedDoctorsArray[index]) == userAddress)
                    {
                            doctorMap[authorisedDoctorsArray[index]] = 0;                            
                    }
                    else
                    {
                        authorisedDoctorsArray[a]=authorisedDoctorsArray[index];
                        a=a+1;
                    }
                }

                if(a==0)
                {
                    delete authorisedDoctorsArray;
                }
                else
                {
                    for(uint index=a;index<authorisedDoctorsArray.length;index++)
                    {
                        authorisedDoctorsArray.pop();
                    }
                }
               
        }

       
        function editMedicalData(string memory data) public returns(bool){
            require(_owner!=msg.sender);
            require(doctorMap[msg.sender]==1);
            medicalData.push(data);
            return true;
        }

        function viewMedicalDataByDoctor() public view returns(string [] memory){
            require(doctorMap[msg.sender]==1);
            return medicalData; 
        }

        function viewMedicalDataByPatient() public view returns(string [] memory){
            require(_owner==msg.sender);
            return medicalData; 
        }


        
        function addHospitalByHospital(address userAddress) public returns(bool){
        
            CentralDatabase centralDatabase = CentralDatabase(_centralDatabase);
            require(centralDatabase.isHospital(msg.sender));
            require(centralDatabase.isHospital(userAddress));

            require(hospitalMap[userAddress]==0);
            authorisedHospitalsArray.push(userAddress);
            hospitalMap[userAddress]=1;
            return true;
        }

        function addHospitalByPatient(address userAddress) public returns(bool) {
            require(_owner == msg.sender);

            CentralDatabase centralDatabase = CentralDatabase(_centralDatabase);
            require(centralDatabase.isHospital(userAddress));
            
            require(hospitalMap[userAddress]==0);

            authorisedHospitalsArray.push(userAddress);
            hospitalMap[userAddress]=1;            
            return true;
        }

        function addDoctorByHospital(address userAddress) public returns(bool){
            
            CentralDatabase centralDatabase = CentralDatabase(_centralDatabase);
            require(centralDatabase.isHospital(msg.sender));
            require(centralDatabase.isDoctor(userAddress));
            require(centralDatabase.getParentHospital(userAddress)==msg.sender);
    
            require(hospitalMap[msg.sender]==1);            
            require(doctorMap[userAddress]==0);
            
            doctorMap[userAddress]=1;
            authorisedDoctorsArray.push(userAddress);
            return true;
        }

        function addDoctorByPatient(address userAddress) public returns(bool){
            require(_owner == msg.sender);
            CentralDatabase centralDatabase = CentralDatabase(_centralDatabase);
            require(centralDatabase.isDoctor(userAddress));
            require(doctorMap[userAddress]==0);

            doctorMap[userAddress]=1;
            authorisedDoctorsArray.push(userAddress);
            return true;
        }
        
        function viewAuthorisedDoctorsArray() public view returns(address [] memory){
            require(_owner==msg.sender);
            return authorisedDoctorsArray; 
        }

        function viewAuthorisedHospitalsArray() public view returns(address [] memory){
            require(_owner==msg.sender);
            return authorisedHospitalsArray; 
        }

          
        function viewRequests() public view returns(address [] memory){
            require(_owner==msg.sender);
            return requests; 
        }

        function submitRequests() public {
                requests.push(msg.sender);
        }

        function deleteRequest(uint ind) public 
        {
            require(_owner==msg.sender);

            if(ind>=0 && ind < requests.length)
            {
                for (uint i = ind; i<requests.length-1; i++)
                {
                    requests[i] = requests[i+1];
                }
                requests.pop();
            }
        }
}