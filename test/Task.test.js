const { assert } = require("chai");

const Task = artifacts.require("./Task.sol");

contract("Task", (accounts) => {
    before(async () => {
        this.taskList = await Task.deployed();
    })

    it("deployed successfully", async () => {
        const address = await this.taskList.address;
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    })

    it("list tasks", async () => {
        const taskCount = await this.taskList.taskCount();
        const task = await this.taskList.tasks(taskCount);
        assert.equal(task.id.toNumber(), taskCount.toNumber());
        assert.equal(task.content, "Init taskList dApp");
        assert.equal(task.completed, false);
        assert.equal(taskCount.toNumber(), 1);
    })

    it("create task", async () => {
        const result = await this.taskList.createTask("Create new task dApp");
        const taskCount = await this.taskList.taskCount();
        assert.equal(taskCount.toNumber(), 2);
        const task = result.logs[0].args;
        assert.equal(task.id.toNumber(), 2);
        assert.equal(task.content, "Create new task dApp");
        assert.equal(task.completed, false);
    })
})