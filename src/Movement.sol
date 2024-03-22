// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MovementStorage {
    struct Petition {
        address creator;
        string name;
        string imageURI;
        uint256 funds;
        address[] signers;
        address[] donors;
    }

    mapping(uint256 => Petition) public petitions;
    uint256 internal totalPetitions;

    event petitioned(address creator, string indexed name, uint256 indexed id);
    event signed(address signee, uint256 indexed id);
    event donated(address signee, uint256 indexed id);
    event withdrew(address creator, uint256 amount, uint256 indexed id);
}

contract Movement is MovementStorage, ERC20 {
    constructor() ERC20("Movement", "MVMT") {}

    address token;

    function create(string memory _name, string memory _imageURI) public {
        address[] memory _signers;
        address[] memory _donors;
        petitions[totalPetitions] = Petition(
            msg.sender,
            _name,
            _imageURI,
            0,
            _signers,
            _donors
        );
        totalPetitions++;
    }

    function sign(uint256 _id) public {
        // logic for signing document and interacting with smart contract
        petitions[_id].signers.push(msg.sender);
    }

    function donate(uint256 _id, uint256 _amount) public payable {
        ERC20(token).approve(address(this), _amount);
        ERC20(token).transferFrom(msg.sender, address(this), _amount);
        petitions[_id].donors.push(msg.sender);
    }

    function withdraw(uint256 _id) public {
        if (petitions[_id].creator != msg.sender) {
            revert("Movement: Access denied");
        } else if (petitions[_id].funds == 0) {
            revert("Movement: No funds available");
        }

        petitions[_id].funds = 0;
        ERC20(token).transfer(msg.sender, petitions[_id].funds);
    }

    function getDonors() public view returns (address[] memory _donors) {}

    function getSigners() public view returns (address[] memory _signers) {}
}
