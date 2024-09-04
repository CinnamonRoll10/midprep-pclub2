// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WorkerTaskContract {
    address public admin;
    address public worker;
    uint public timeRequired;
    uint public hourlyWage;
    uint public deadline;
    bool public taskCompleted;
    uint public startTime;

    event TaskCompleted(uint payment, address worker);

    constructor(
        address _admin,
        address _worker,
        uint _timeRequired,
        uint _hourlyWage,
        uint _deadline
    ) {
        admin = _admin;
        worker = _worker;
        timeRequired = _timeRequired;
        hourlyWage = _hourlyWage;
        deadline = _deadline;
        startTime = block.timestamp;
        taskCompleted = false;
    }

    modifier onlyWorker() {
        require(msg.sender == worker, "Only the assigned worker can call this function");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }

    function completeTask() public onlyWorker {
        require(!taskCompleted, "Task already completed");

        uint timeWorked = block.timestamp - startTime;
        if (timeWorked > timeRequired) {
            timeWorked = timeRequired; // Cap the time worked to the maximum required time
        }

        uint payment = (timeWorked / 1 hours) * hourlyWage; // Calculate payment based on actual hours worked

        (bool success, ) = worker.call{value: payment}("");
        require(success, "Payment failed");

        taskCompleted = true;

        emit TaskCompleted(payment, worker);
    }

    receive() external payable {}
}
