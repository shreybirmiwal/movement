// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract TestERC20 is ERC20, Ownable, ERC20Permit {
    constructor(
        address initialOwner
    ) ERC20("Test ERC20", "TEST") Ownable(initialOwner) ERC20Permit("Test") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
