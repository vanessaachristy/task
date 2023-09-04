// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Task {

    // state variables, state of smart contract change every time this variable change
    uint public taskCount = 0;
    
    struct Task {
        uint id;
        string content;
        bool completed;
    }

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );


    mapping(uint => Task) public tasks;


    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }


    constructor() public {
        createTask("Init taskList dApp");
    }

}