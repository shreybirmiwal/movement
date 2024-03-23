// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Movement} from "../src/Movement.sol";
import {TestERC20} from "../src/TestERC20.sol";

contract MovementTest is Test {
    constructor() {}

    Movement movement;
    TestERC20 erc20;
    address sree = 0x8B603f2890694cF31689dFDA28Ff5e79917243e9;

    function setUp() public {
        erc20 = new TestERC20(address(this));
        movement = new Movement(address(erc20));
        erc20.mint(sree, 1000);
    }

    function testCreate() public {
        movement.create("test", "testpdf.com", "testimg.com");
        Movement.Petition[] memory petitions = movement.getPetitions();
        assert(petitions.length > 0);
        assert(petitions[0].creator == address(this));
        assertEq(petitions[0].name, "test");
        assertEq(petitions[0].pdfURI, "testpdf.com");
        assertEq(petitions[0].imageURI, "testimg.com");
        assert(petitions[0].funds == 0);
        assert(petitions[0].donors.length == 0);
    }

    function testSign() public {
        testCreate();
        vm.startPrank(sree);
        movement.sign(0);
        vm.stopPrank();
        Movement.Petition[] memory petitions = movement.getPetitions();
        assert(petitions[0].signers.length == 1);
        assert(petitions[0].signers[0] == sree);
    }

    function testDonate() public {
        testCreate();
        vm.startPrank(sree);
        assert(erc20.balanceOf(sree) == 1000);
        erc20.approve(address(movement), 100);
        movement.donate(0, 100);
        vm.stopPrank();
        Movement.Petition[] memory petitions = movement.getPetitions();
        assert(petitions[0].funds == 100);
    }

    function testWithdraw() public {
        testDonate();
        movement.withdraw(0);
        Movement.Petition[] memory petitions = movement.getPetitions();
        assert(petitions[0].funds == 0);
    }
}
