// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract MovementStorage {
    struct Petition {
        uint256 id;
        address creator;
        string name;
        string pdfURI;
        string imageURI;
        uint256 funds;
        address[] donors;
        address[] signers;
    }

    Petition[] public petitions;

    event petitioned(address creator, string indexed name, uint256 indexed id);
}

contract Movement is MovementStorage {
    function create(
        string memory _name,
        string memory _pdfURI,
        string memory _imageURI
    ) public {
        address[] memory _donors;
        address[] memory _signers;
        petitions.push(
            Petition(
                petitions.length,
                msg.sender,
                _name,
                _pdfURI,
                _imageURI,
                0,
                _donors,
                _signers
            )
        );
        emit petitioned(msg.sender, _name, petitions.length - 1);
    }

    function sign(uint256 _id) public {
        for (uint256 i = 0; i < petitions[_id].signers.length; i++) {
            if (petitions[_id].signers[i] == msg.sender) {
                revert("Movement: Already signed this petition");
            }
        }
        petitions[_id].signers.push(msg.sender);
    }

    function getTotalSigners(uint256 _id) public view returns (uint256) {
        return petitions[_id].signers.length;
    }

    function getPetitions() public view returns (Petition[] memory) {
        return petitions;
    }

    function getImageURI(uint _id) public view returns (string memory) {
        return petitions[_id].imageURI;
    }

    function getDonationAddress(uint _id) public view returns (address) {
        return petitions[_id].creator;
    }

    function getPDFURI(uint _id) public view returns (string memory) {
        return petitions[_id].pdfURI;
    }
}
