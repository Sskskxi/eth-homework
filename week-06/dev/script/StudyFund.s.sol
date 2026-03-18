// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {StudyFund} from "../src/StudyFund.sol";

contract StudyFundScript is Script {
    function run() external returns (StudyFund fund) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);
        fund = new StudyFund();
        vm.stopBroadcast();

        console.log("StudyFund deployed at:", address(fund));
    }
}
