// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./WorkerTaskContract.sol"; // Import the WorkerTaskContract

contract TaskAllocation {
    struct Worker {
        uint availableHours;
        uint expertiseLevel;
        uint minHourlyWage;
        address wallet;
        bool isRegistered;
    }

    struct Task {
        uint timeRequired;
        uint expertiseLevel;
        uint hourlyWage;
        uint deadline;
        bool isDivisible;
        bool isAllocated;
        address workerTaskContract; // Store the address of the WorkerTaskContract
    }

    address public admin;
    uint public totalTasks;
    uint public totalWorkers;
    mapping(uint => Worker) public workers;
    mapping(uint => Task) public tasks;

    event WorkerRegistered(uint workerId, address wallet);
    event TaskAdded(uint taskId, uint timeRequired);
    event TaskAllocated(uint taskId, address worker, address workerTaskContract);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function registerWorker(uint _availableHours, uint _expertiseLevel, uint _minHourlyWage) public {
        totalWorkers++;
        workers[totalWorkers] = Worker({
            availableHours: _availableHours,
            expertiseLevel: _expertiseLevel,
            minHourlyWage: _minHourlyWage,
            wallet: msg.sender,
            isRegistered: true
        });

        emit WorkerRegistered(totalWorkers, msg.sender);
    }

    function addTask(uint _timeRequired, uint _expertiseLevel, uint _hourlyWage, uint _deadline, bool _isDivisible) public onlyAdmin {
        totalTasks++;
        tasks[totalTasks] = Task({
            timeRequired: _timeRequired,
            expertiseLevel: _expertiseLevel,
            hourlyWage: _hourlyWage,
            deadline: _deadline,
            isDivisible: _isDivisible,
            isAllocated: false,
            workerTaskContract: address(0) // Initially no contract is assigned
        });

        emit TaskAdded(totalTasks, _timeRequired);
    }

    function allocateTask(uint taskId, uint workerId) public onlyAdmin {
        Task storage task = tasks[taskId];
        Worker storage worker = workers[workerId];

        require(!task.isAllocated, "Task already allocated");
        require(worker.isRegistered, "Worker is not registered");
        require(worker.availableHours >= task.timeRequired, "Worker does not have enough available hours");
        require(worker.expertiseLevel >= task.expertiseLevel, "Worker does not have required expertise level");
        require(task.hourlyWage >= worker.minHourlyWage, "Hourly wage is less than worker's minimum acceptable wage");

        task.isAllocated = true;

        // Deploy a new WorkerTaskContract
        WorkerTaskContract workerTaskContract = new WorkerTaskContract(
            admin,
            worker.wallet,
            task.timeRequired,
            task.hourlyWage,
            task.deadline
        );

        task.workerTaskContract = address(workerTaskContract);

        worker.availableHours -= task.timeRequired;

        emit TaskAllocated(taskId, worker.wallet, address(workerTaskContract));
    }

    function getWorkerDetails(uint workerId) public view returns (Worker memory) {
        return workers[workerId];
    }

    function getTaskDetails(uint taskId) public view returns (Task memory) {
        return tasks[taskId];
    }

    function getAllTasks() public view returns (Task[] memory) {
        Task[] memory allTasks = new Task[](totalTasks); // Assuming you have a variable tracking total task count
        for (uint i = 0; i < totalTasks; i++) {
            allTasks[i] = tasks[i];
        }
        return allTasks;
    }



    receive() external payable {}
}
