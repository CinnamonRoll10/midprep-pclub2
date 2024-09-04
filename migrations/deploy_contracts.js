var Task = artifacts.require("./Task_Allocation.sol");

module.exports = function(deployer) {
  deployer.deploy(TaskAllocation);
};
