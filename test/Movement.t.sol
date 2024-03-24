// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Movement} from "../src/Movement.sol";

contract MovementTest is Test {
    constructor() {}

    Movement movement;
    address sree = 0x8B603f2890694cF31689dFDA28Ff5e79917243e9;

    function setUp() public {
        movement = new Movement();
        vm.deal(address(sree), 1000 ether);
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
        movement.donate{value: 1 * 10 ** 18}(0);
        vm.stopPrank();
        Movement.Petition[] memory petitions = movement.getPetitions();
        assert(petitions[0].funds == 1 ether);
        assert(petitions[0].donors.length == 1);
    }

    // function testWithdraw() public {
    //     testDonate();
    //     movement.withdraw(0);
    //     Movement.Petition[] memory petitions = movement.getPetitions();
    //     assert(petitions[0].funds == 0 ether);
    // }
}
