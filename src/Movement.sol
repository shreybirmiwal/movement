// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

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
    event donated(address signee, uint256 indexed id);
    event withdrew(address creator, uint256 amount, uint256 indexed id);
}

contract Movement is MovementStorage, ERC20 {
    address public immutable token;

    constructor(address _token) ERC20("Movement", "MVMT") {
        token = _token;
    }

    function create(
        string memory _name,
        string memory pdfURI,
        string memory _imageURI
    ) public {
        address[] memory _donors;
        address[] memory _signers;
        petitions.push(
            Petition(
                petitions.length,
                msg.sender,
                _name,
                pdfURI,
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

    function donate(uint256 _id, uint256 _amount) public {
        ERC20(token).approve(address(this), _amount);
        ERC20(token).transferFrom(msg.sender, address(this), _amount);
        bool isDonor = false;
        for (uint256 i = 0; i < petitions[_id].donors.length; i++) {
            if (petitions[_id].donors[i] == msg.sender) {
                isDonor = true;
                break;
            }
        }

        if (!isDonor) {
            petitions[_id].donors.push(msg.sender);
        }

        petitions[_id].funds += _amount;
        emit donated(msg.sender, _id);
    }

    function withdraw(uint256 _id) public {
        if (petitions[_id].creator != msg.sender) {
            revert("Movement: Access denied");
        } else if (petitions[_id].funds == 0) {
            revert("Movement: No funds available");
        }

        petitions[_id].funds = 0;
        ERC20(token).transfer(msg.sender, petitions[_id].funds);
        emit withdrew(msg.sender, petitions[_id].funds, _id);
    }

    function getTotalDonors(uint256 _id) public view returns (uint256) {
        return petitions[_id].donors.length;
    }

    function getTotalSigners(
        uint256 _id
    ) public view returns (address[] memory) {
        return petitions[_id].signers;
    }

    function getPetitions() public view returns (Petition[] memory) {
        return petitions;
    }

    function getImageURI(uint _id) public view returns (string memory) {
        return petitions[_id].imageURI;
    }

    function getPDFURI(uint _id) public view returns (string memory) {
        return petitions[_id].pdfURI;
    }
}
