// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0;

     contract CentralDatabase {

        mapping(address => address) private identityCard;  
        mapping(address => uint) private hospital;
        mapping(address => uint) private patient;
        mapping(address => uint) private doctor;
        address private _owner;
    
        constructor() 
        {
            _owner = msg.sender;
        }

        function updateDoctor(address userAddress, address identityCardAddress ) public {
            require(hospital[msg.sender]==1);
            patient[userAddress] = 0;
            doctor[userAddress] = 1;
            hospital[userAddress] = 0;
            identityCard[userAddress]=identityCardAddress;
        }
        
        function updatePatient(address userAddress , address identityCardAddress) public {
            require(hospital[msg.sender]==1);
            patient[userAddress] = 1;
            doctor[userAddress] = 0;
            hospital[userAddress] = 0;
            identityCard[userAddress]=identityCardAddress;
        }

        function updateHospital(address userAddress , address identityCardAddress) public {
            require(_owner == msg.sender);
            hospital[userAddress] = 1;
            doctor[userAddress] = 0;
            patient[userAddress]=0;
            identityCard[userAddress]=identityCardAddress;
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

    }


    contract IdentityCard{
        
        uint _role; // 0 -> hospital , 1 -> doct , 2-> patient
        address _parentHospital;
        address _medicalData;
        
        address private _owner;
        
       
        constructor(uint role) 
        {
            _owner = msg.sender;
            _role = role;        
        }

        function updateParentHospital(address parentHospital) public {
            require(_owner == msg.sender);
            require(_role > 0);
            _parentHospital = parentHospital;

        }

        function updateMedicalData(address medicalData) public {
            require(_owner == msg.sender);
            require(_role > 1);
            _medicalData = medicalData;
        }
        
        function viewParentHospital() public view returns(address)
        {
            return _parentHospital;
        }

        function viewMedicalData() public view returns(address)
        {
            return _medicalData;
        }
    }


   

    contract UserMedicalData
    { 
        string [] private medicalData;
        address[] private authorised ;
        address private _owner;
        address _centralDatabase;

        constructor(address centralDatabase)
        {
            _owner = msg.sender;
            authorised.push(_owner);
            _centralDatabase = centralDatabase;
        }

        modifier onlyOwner() 
        {
            require(isOwner(),
            "Function accessible only by the Owner!!");
            _;
        }
        function isOwner() public view returns(bool) 
        {
            return _owner==msg.sender;
        }

        function isNotOwner() public view returns(bool) 
        {
            return _owner!=msg.sender;
        }

        function removeDoctor(address _msg) onlyOwner public 
        {
                uint ind =0;
                for(uint i=0;i<authorised.length ;i++)
                {
                    if(authorised[i]==_msg)
                        ind=i;
                }
                if(ind>0)
                {
                    delete authorised[ind];
                }
            
        }

        modifier onlyAuthorized() 
        {
            require(isAuthorized(),
            "Function accessible only by the authorised doctor!!");
            _;
        }

        function isAuthorized() public view returns(bool) 
        {
            for(uint i=0;i<authorised.length ;i++)
            {
                if(authorised[i]==msg.sender)
                    return true;
            }
            return false;
        }

        function addMedicalData(string memory _msg) public returns(bool){
            require(isAuthorized());
            require(isNotOwner());
            CentralDatabase centralDatabase = CentralDatabase(_centralDatabase);
            require(centralDatabase.isDoctor(msg.sender));
            medicalData.push(_msg);
            return true;
        }
        
        function addHospitalByHospital(address _msg) public returns(bool){
            require(isAuthorized());
            CentralDatabase centralDatabase = CentralDatabase(_centralDatabase);
            require(centralDatabase.isHospital(msg.sender));
            require(centralDatabase.isHospital(_msg));
            authorised.push(_msg);
            return true;
        }

        function addHospitalByPatient(address _msg) public returns(bool){
             require(_owner == msg.sender);
            CentralDatabase centralDatabase = CentralDatabase(_centralDatabase);
            require(centralDatabase.isHospital(_msg));
            authorised.push(_msg);
            return true;
        }

        function addDoctorByHospital(address _msg) public returns(bool){
            require(isAuthorized());
            CentralDatabase centralDatabase = CentralDatabase(_centralDatabase);
            require(centralDatabase.isHospital(msg.sender));
            require(centralDatabase.isDoctor(_msg));
            authorised.push(_msg);
            return true;
        }

        function addDoctorByPatient(address _msg) public returns(bool){
            require(_owner == msg.sender);
            CentralDatabase centralDatabase = CentralDatabase(_centralDatabase);
            require(centralDatabase.isDoctor(_msg));
            authorised.push(_msg);
            return true;
        }

}

