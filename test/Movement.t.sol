// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Movement} from "../src/Movement.sol";
import {TestERC20} from "../src/TestERC20.sol";

contract MovementTest is Test, TestERC20 {
    constructor() TestERC20(msg.sender) {}

    Movement movement;
    TestERC20 erc20;
    address sree = 0x8B603f2890694cF31689dFDA28Ff5e79917243e9;

    function setUp() public {
        movement = new Movement();
        erc20 = new TestERC20(address(this));
        erc20.mint(sree, 1000);
    }
}
