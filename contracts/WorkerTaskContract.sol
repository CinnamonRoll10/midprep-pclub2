// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WorkerTaskContract {
    address public admin;
    address public worker;
    uint public timeRequired;
    uint public hourlyWage;
    uint public deadline;
    bool public taskCompleted;

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
        require(block.timestamp >= deadline, "Cannot complete task before the deadline");
        require(!taskCompleted, "Task already completed");

        uint payment = timeRequired * hourlyWage;

        (bool success, ) = worker.call{value: payment}("");
        require(success, "Payment failed");

        taskCompleted = true;

        emit TaskCompleted(payment, worker);
    }

    receive() external payable {}
}
