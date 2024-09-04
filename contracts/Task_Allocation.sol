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
        uint parentTaskId; // Parent Task ID if this is a sub-task
    }

    address public admin;
    uint public totalTasks;
    uint public totalWorkers;
    uint public lastTaskOrWorkerUpdate; // To track the last update
    uint public allocationGapLimit = 5; // Expertise gap limit
    mapping(uint => Worker) public workers;
    mapping(uint => Task) public tasks;
    mapping(uint => address) public taskToWorker;
    mapping(address => uint[]) public workerToTasks;
    mapping(address => uint) public addressToWorkerId; // Mapping from address to worker ID

    uint[] public unallocatedTasks;
    address[] public unallocatedWorkers;

    event WorkerRegistered(uint workerId, address wallet);
    event TaskAdded(uint taskId, uint timeRequired);
    event TaskAllocated(uint taskId, address worker, address workerTaskContract);
    event TaskSplit(uint originalTaskId, uint[] subTaskIds); // New event for task splitting

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
        addressToWorkerId[msg.sender] = totalWorkers; // Map address to worker ID

        // Add to unallocated workers list
        unallocatedWorkers.push(msg.sender);
        
        emit WorkerRegistered(totalWorkers, msg.sender);
        
        // Attempt task allocation after a new worker is registered
        allocateTasksAutomatically();
    }

    function addTask(uint _timeRequired, uint _expertiseLevel, uint _hourlyWage, uint _deadline, bool _isDivisible, uint[] memory _subTaskTimes) public onlyAdmin {
        totalTasks++;
        tasks[totalTasks] = Task({
            timeRequired: _timeRequired,
            expertiseLevel: _expertiseLevel,
            hourlyWage: _hourlyWage,
            deadline: _deadline,
            isDivisible: _isDivisible,
            isAllocated: false,
            workerTaskContract: address(0), // Initially no contract is assigned
            parentTaskId: 0 // 0 indicates no parent task
        });

        // If the task is divisible, split it into sub-tasks
        if (_isDivisible) {
            require(_subTaskTimes.length > 0, "Sub-task times are required for divisible tasks");
            splitTask(totalTasks, _subTaskTimes);
        } else {
            // Add to unallocated tasks list
            unallocatedTasks.push(totalTasks);
        }

        emit TaskAdded(totalTasks, _timeRequired);
        
        // Attempt task allocation after a new task is added
        allocateTasksAutomatically();
    }

    function splitTask(uint taskId, uint[] memory subTaskTimes) internal {
        Task storage task = tasks[taskId];
        require(task.isDivisible, "Task is not divisible");
        require(!task.isAllocated, "Task is already allocated");

        uint totalSubTime = 0;
        for (uint i = 0; i < subTaskTimes.length; i++) {
            totalSubTime += subTaskTimes[i];
        }
        require(totalSubTime == task.timeRequired, "Sub-tasks time must match the original task time");

        uint[] memory subTaskIds = new uint[](subTaskTimes.length);

        for (uint i = 0; i < subTaskTimes.length; i++) {
            totalTasks++;
            tasks[totalTasks] = Task({
                timeRequired: subTaskTimes[i],
                expertiseLevel: task.expertiseLevel,
                hourlyWage: task.hourlyWage,
                deadline: task.deadline,
                isDivisible: false, // Sub-tasks are not further divisible
                isAllocated: false,
                workerTaskContract: address(0),
                parentTaskId: taskId // Set the parent task ID
            });

            subTaskIds[i] = totalTasks;
            unallocatedTasks.push(totalTasks);
        }

        // Remove the original divisible task from the unallocated tasks list
        for (uint i = 0; i < unallocatedTasks.length; i++) {
            if (unallocatedTasks[i] == taskId) {
                unallocatedTasks[i] = unallocatedTasks[unallocatedTasks.length - 1];
                unallocatedTasks.pop();
                break;
            }
        }

        emit TaskSplit(taskId, subTaskIds);
    }

    function allocateTasksAutomatically() internal {
        for (uint i = 0; i < unallocatedTasks.length; i++) {
            uint taskId = unallocatedTasks[i];
            Task storage task = tasks[taskId];
            if (!task.isAllocated) {
                address bestWorker = address(0);
                uint minExpertiseGap = type(uint).max;
                
                for (uint j = 0; j < unallocatedWorkers.length; j++) {
                    address workerAddress = unallocatedWorkers[j];
                    uint workerId = addressToWorkerId[workerAddress];
                    Worker storage worker = workers[workerId];
                    
                    uint expertiseGap = task.expertiseLevel > worker.expertiseLevel ? task.expertiseLevel - worker.expertiseLevel : worker.expertiseLevel - task.expertiseLevel;
                    
                    if (worker.availableHours >= task.timeRequired &&
                        expertiseGap <= allocationGapLimit &&
                        task.hourlyWage >= worker.minHourlyWage &&
                        expertiseGap < minExpertiseGap) {
                            
                        bestWorker = workerAddress;
                        minExpertiseGap = expertiseGap;
                    }
                }
                
                if (bestWorker != address(0)) {
                    allocateTask(taskId, addressToWorkerId[bestWorker]);
                    // Remove allocated worker from the unallocated workers list
                    for (uint k = 0; k < unallocatedWorkers.length; k++) {
                        if (unallocatedWorkers[k] == bestWorker) {
                            unallocatedWorkers[k] = unallocatedWorkers[unallocatedWorkers.length - 1];
                            unallocatedWorkers.pop();
                            break;
                        }
                    }
                }
            }
        }
        
        lastTaskOrWorkerUpdate = block.timestamp; // Update last task or worker update timestamp
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
        taskToWorker[taskId] = worker.wallet;
        workerToTasks[worker.wallet].push(taskId);
        worker.availableHours -= task.timeRequired;

        emit TaskAllocated(taskId, worker.wallet, address(workerTaskContract));
    }

    function getWorkerForTask(uint taskId) public view returns (address) {
        return taskToWorker[taskId];
    }

    function getWorkerDetails(uint workerId) public view returns (Worker memory) {
        return workers[workerId];
    }

    function getTaskDetails(uint taskId) public view returns (Task memory) {
        return tasks[taskId];
    }

    function getAllTasks() public view returns (Task[] memory) {
        Task[] memory allTasks = new Task[](totalTasks);
        for (uint i = 0; i < totalTasks; i++) {
            allTasks[i] = tasks[i];
        }
        return allTasks;
    }

    function getWorkerTasks(address worker) public view returns (uint[] memory) {
        return workerToTasks[worker];
    }

    function getWorkerIdByAddress(address _workerAddress) public view returns (uint) {
        return addressToWorkerId[_workerAddress];
    }

    function getUnallocatedTasks() public view returns (uint[] memory) {
        return unallocatedTasks;
    }

    function getUnallocatedWorkers() public view returns (address[] memory) {
        return unallocatedWorkers;
    }

    receive() external payable {}
}
