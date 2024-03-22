// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Movement} from "../src/Movement.sol";

contract MovementTest is Test {
    Movement public movement;

    function setUp() public {
        movement = new Movement();
    }
}
