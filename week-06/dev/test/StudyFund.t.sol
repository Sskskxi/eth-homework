// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {StudyFund} from "../src/StudyFund.sol";

contract StudyFundTest is Test {
    StudyFund public fund;

    address creator = makeAddr("creator");
    address donor1  = makeAddr("donor1");
    address donor2  = makeAddr("donor2");

    uint256 constant GOAL     = 1 ether;
    uint256 constant DURATION = 7; // days

    function setUp() public {
        fund = new StudyFund();
        vm.deal(donor1, 10 ether);
        vm.deal(donor2, 10 ether);
    }

    // ──────────────────────────────────────────────
    //  createCampaign
    // ──────────────────────────────────────────────

    function test_createCampaign_succeeds() public {
        vm.prank(creator);
        uint256 id = fund.createCampaign("AP Chemistry tutoring", "Need a tutor", "Chemistry", GOAL, DURATION);

        assertEq(id, 1);
        assertEq(fund.campaignCount(), 1);

        StudyFund.Campaign memory c = fund.getCampaign(1);
        assertEq(c.creator, creator);
        assertEq(c.title, "AP Chemistry tutoring");
        assertEq(c.goal, GOAL);
        assertEq(c.raised, 0);
        assertFalse(c.withdrawn);
    }

    function test_createCampaign_emitsEvent() public {
        vm.prank(creator);
        vm.expectEmit(true, true, false, true);
        emit StudyFund.CampaignCreated(1, creator, "Geometry workbook", GOAL, block.timestamp + DURATION * 1 days);
        fund.createCampaign("Geometry workbook", "Supplies", "Math", GOAL, DURATION);
    }

    function test_createCampaign_revertsOnEmptyTitle() public {
        vm.prank(creator);
        vm.expectRevert(StudyFund.EmptyTitle.selector);
        fund.createCampaign("", "desc", "Math", GOAL, DURATION);
    }

    function test_createCampaign_revertsOnZeroGoal() public {
        vm.prank(creator);
        vm.expectRevert(StudyFund.InvalidGoal.selector);
        fund.createCampaign("Title", "desc", "Math", 0, DURATION);
    }

    function test_createCampaign_revertsOnZeroDuration() public {
        vm.prank(creator);
        vm.expectRevert(StudyFund.InvalidDuration.selector);
        fund.createCampaign("Title", "desc", "Math", GOAL, 0);
    }

    function test_createCampaign_revertsOnTooLongDuration() public {
        vm.prank(creator);
        vm.expectRevert(StudyFund.InvalidDuration.selector);
        fund.createCampaign("Title", "desc", "Math", GOAL, 366);
    }

    // ──────────────────────────────────────────────
    //  donate
    // ──────────────────────────────────────────────

    function test_donate_succeeds() public {
        _createDefaultCampaign();

        vm.prank(donor1);
        fund.donate{value: 0.5 ether}(1);

        StudyFund.Campaign memory c = fund.getCampaign(1);
        assertEq(c.raised, 0.5 ether);
    }

    function test_donate_emitsEvent() public {
        _createDefaultCampaign();

        vm.prank(donor1);
        vm.expectEmit(true, true, false, true);
        emit StudyFund.Donated(1, donor1, 0.3 ether);
        fund.donate{value: 0.3 ether}(1);
    }

    function test_donate_multipleDonors_accumulates() public {
        _createDefaultCampaign();

        vm.prank(donor1);
        fund.donate{value: 0.4 ether}(1);

        vm.prank(donor2);
        fund.donate{value: 0.6 ether}(1);

        assertEq(fund.getCampaign(1).raised, 1 ether);
    }

    function test_donate_revertsAfterDeadline() public {
        _createDefaultCampaign();
        vm.warp(block.timestamp + DURATION * 1 days + 1);

        vm.prank(donor1);
        vm.expectRevert(StudyFund.CampaignEnded.selector);
        fund.donate{value: 0.5 ether}(1);
    }

    function test_donate_revertsOnZeroValue() public {
        _createDefaultCampaign();

        vm.prank(donor1);
        vm.expectRevert(StudyFund.ZeroDonation.selector);
        fund.donate{value: 0}(1);
    }

    function test_donate_revertsOnInvalidCampaign() public {
        vm.prank(donor1);
        vm.expectRevert(StudyFund.CampaignNotFound.selector);
        fund.donate{value: 0.1 ether}(99);
    }

    // ──────────────────────────────────────────────
    //  withdraw
    // ──────────────────────────────────────────────

    function test_withdraw_succeeds() public {
        _createDefaultCampaign();

        vm.prank(donor1);
        fund.donate{value: GOAL}(1);

        vm.warp(block.timestamp + DURATION * 1 days + 1);

        uint256 before = creator.balance;

        vm.prank(creator);
        fund.withdraw(1);

        assertEq(creator.balance, before + GOAL);
        assertTrue(fund.getCampaign(1).withdrawn);
    }

    function test_withdraw_emitsEvent() public {
        _createDefaultCampaign();

        vm.prank(donor1);
        fund.donate{value: GOAL}(1);

        vm.warp(block.timestamp + DURATION * 1 days + 1);

        vm.prank(creator);
        vm.expectEmit(true, true, false, true);
        emit StudyFund.Withdrawn(1, creator, GOAL);
        fund.withdraw(1);
    }

    function test_withdraw_revertsBeforeDeadline() public {
        _createDefaultCampaign();

        vm.prank(donor1);
        fund.donate{value: GOAL}(1);

        vm.prank(creator);
        vm.expectRevert(StudyFund.DeadlineNotReached.selector);
        fund.withdraw(1);
    }

    function test_withdraw_revertsIfNotCreator() public {
        _createDefaultCampaign();

        vm.prank(donor1);
        fund.donate{value: GOAL}(1);

        vm.warp(block.timestamp + DURATION * 1 days + 1);

        vm.prank(donor1);
        vm.expectRevert(StudyFund.NotCreator.selector);
        fund.withdraw(1);
    }

    function test_withdraw_revertsIfAlreadyWithdrawn() public {
        _createDefaultCampaign();

        vm.prank(donor1);
        fund.donate{value: GOAL}(1);

        vm.warp(block.timestamp + DURATION * 1 days + 1);

        vm.prank(creator);
        fund.withdraw(1);

        vm.prank(creator);
        vm.expectRevert(StudyFund.AlreadyWithdrawn.selector);
        fund.withdraw(1);
    }

    function test_withdraw_revertsIfNothingRaised() public {
        _createDefaultCampaign();

        vm.warp(block.timestamp + DURATION * 1 days + 1);

        vm.prank(creator);
        vm.expectRevert(StudyFund.NothingToWithdraw.selector);
        fund.withdraw(1);
    }

    // ──────────────────────────────────────────────
    //  getCampaigns
    // ──────────────────────────────────────────────

    function test_getCampaigns_returnsAll() public {
        vm.startPrank(creator);
        fund.createCampaign("Campaign A", "desc", "Math", GOAL, DURATION);
        fund.createCampaign("Campaign B", "desc", "Biology", GOAL, DURATION);
        fund.createCampaign("Campaign C", "desc", "Writing", GOAL, DURATION);
        vm.stopPrank();

        StudyFund.Campaign[] memory all = fund.getCampaigns();
        assertEq(all.length, 3);
        assertEq(all[0].title, "Campaign A");
        assertEq(all[1].title, "Campaign B");
        assertEq(all[2].title, "Campaign C");
    }

    function test_getCampaigns_emptyWhenNoneCreated() public view {
        StudyFund.Campaign[] memory all = fund.getCampaigns();
        assertEq(all.length, 0);
    }

    // ──────────────────────────────────────────────
    //  Fuzz
    // ──────────────────────────────────────────────

    function testFuzz_donate_accumulates(uint96 amount1, uint96 amount2) public {
        vm.assume(amount1 > 0 && amount2 > 0);
        vm.assume(uint256(amount1) + uint256(amount2) <= 10 ether);

        _createDefaultCampaign();

        vm.deal(donor1, amount1);
        vm.deal(donor2, amount2);

        vm.prank(donor1);
        fund.donate{value: amount1}(1);

        vm.prank(donor2);
        fund.donate{value: amount2}(1);

        assertEq(fund.getCampaign(1).raised, uint256(amount1) + uint256(amount2));
    }

    // ──────────────────────────────────────────────
    //  Helpers
    // ──────────────────────────────────────────────

    function _createDefaultCampaign() internal {
        vm.prank(creator);
        fund.createCampaign("AP Chemistry tutoring", "Need a tutor for AP Chem", "Chemistry", GOAL, DURATION);
    }
}
