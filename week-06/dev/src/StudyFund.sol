// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title StudyFund
 * @notice A crowdfunding contract for student learning needs.
 *         Anyone can create a campaign; supporters donate ETH;
 *         creator withdraws once the deadline passes (goal reached or not).
 */
contract StudyFund {
    // ──────────────────────────────────────────────
    //  Reentrancy guard (CEI + mutex)
    // ──────────────────────────────────────────────

    uint256 private _status;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor() {
        _status = _NOT_ENTERED;
    }
    // ──────────────────────────────────────────────
    //  Structs & Storage
    // ──────────────────────────────────────────────

    struct Campaign {
        uint256 id;
        address creator;
        string title;
        string description;
        string subject;
        uint256 goal;      // in wei
        uint256 raised;    // in wei
        uint256 deadline;  // unix timestamp
        bool withdrawn;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) private campaigns;

    // ──────────────────────────────────────────────
    //  Events
    // ──────────────────────────────────────────────

    event CampaignCreated(
        uint256 indexed id,
        address indexed creator,
        string title,
        uint256 goal,
        uint256 deadline
    );

    event Donated(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event Withdrawn(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount
    );

    // ──────────────────────────────────────────────
    //  Errors
    // ──────────────────────────────────────────────

    error InvalidGoal();
    error InvalidDuration();
    error EmptyTitle();
    error CampaignNotFound();
    error CampaignEnded();
    error ZeroDonation();
    error DeadlineNotReached();
    error NotCreator();
    error AlreadyWithdrawn();
    error NothingToWithdraw();

    // ──────────────────────────────────────────────
    //  Functions
    // ──────────────────────────────────────────────

    /**
     * @notice Create a new funding campaign.
     * @param title        Short campaign title.
     * @param description  Detailed description.
     * @param subject      Category (Math, Biology, Writing, …).
     * @param goal         Funding goal in wei.
     * @param durationDays Campaign duration in days (1–365).
     */
    function createCampaign(
        string calldata title,
        string calldata description,
        string calldata subject,
        uint256 goal,
        uint256 durationDays
    ) external returns (uint256 id) {
        if (bytes(title).length == 0) revert EmptyTitle();
        if (goal == 0) revert InvalidGoal();
        if (durationDays == 0 || durationDays > 365) revert InvalidDuration();

        id = ++campaignCount;
        uint256 deadline = block.timestamp + durationDays * 1 days;

        campaigns[id] = Campaign({
            id: id,
            creator: msg.sender,
            title: title,
            description: description,
            subject: subject,
            goal: goal,
            raised: 0,
            deadline: deadline,
            withdrawn: false
        });

        emit CampaignCreated(id, msg.sender, title, goal, deadline);
    }

    /**
     * @notice Donate ETH to an active campaign.
     * @param campaignId Target campaign id.
     */
    function donate(uint256 campaignId) external payable nonReentrant {
        Campaign storage c = _requireExists(campaignId);

        if (block.timestamp > c.deadline) revert CampaignEnded();
        if (msg.value == 0) revert ZeroDonation();

        // CEI: state update before any external interaction
        c.raised += msg.value;

        emit Donated(campaignId, msg.sender, msg.value);
    }

    /**
     * @notice Creator withdraws raised funds after the deadline.
     * @param campaignId Target campaign id.
     */
    function withdraw(uint256 campaignId) external nonReentrant {
        Campaign storage c = _requireExists(campaignId);

        if (msg.sender != c.creator) revert NotCreator();
        if (block.timestamp <= c.deadline) revert DeadlineNotReached();
        if (c.withdrawn) revert AlreadyWithdrawn();
        if (c.raised == 0) revert NothingToWithdraw();

        // CEI: mark withdrawn before transfer
        uint256 amount = c.raised;
        c.withdrawn = true;

        emit Withdrawn(campaignId, msg.sender, amount);

        (bool ok,) = msg.sender.call{value: amount}("");
        require(ok, "Transfer failed");
    }

    // ──────────────────────────────────────────────
    //  View helpers
    // ──────────────────────────────────────────────

    function getCampaign(uint256 campaignId) external view returns (Campaign memory) {
        return _requireExists(campaignId);
    }

    function getCampaigns() external view returns (Campaign[] memory all) {
        all = new Campaign[](campaignCount);
        for (uint256 i = 1; i <= campaignCount; i++) {
            all[i - 1] = campaigns[i];
        }
    }

    // ──────────────────────────────────────────────
    //  Internal
    // ──────────────────────────────────────────────

    function _requireExists(uint256 campaignId) internal view returns (Campaign storage c) {
        if (campaignId == 0 || campaignId > campaignCount) revert CampaignNotFound();
        c = campaigns[campaignId];
    }
}
