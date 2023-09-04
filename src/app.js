App = {
  loading: false,
  contracts: {},

  load: async () => {
    console.log("App loading...");

    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },


  loadAccount: async () => {
    // Set current blockchain account
    web3.eth.getAccounts((err, accounts) => {
        App.account = accounts[0];
    })
  },

  loadContract: async () => {
    // Create js version of smart contract
    const taskList = await $.getJSON('Task.json');
    App.contracts.TaskList = TruffleContract(taskList);
    App.contracts.TaskList.setProvider(App.web3Provider);

    // Getting values from the blockchain
    App.taskList = await App.contracts.TaskList.deployed();
  },

  setLoading: async (boolean) => {
    App.loading = boolean;
    const loader = $("#loader")
    const content = $('#content')
    if (App.loading) {
        loader.show();
        content.hide();
    }

     else {
        content.show();
        loader.hide();
    }
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
        return;
    }

    // Update app loading state
    App.setLoading(true);

    // Render account
    document.getElementById("account").innerHTML = App.account;

    await App.renderTasks();

    App.setLoading(false);
  },

    renderTasks: async () => {

        // Load total taskCount from blockchain
        let taskCount = await App.taskList.taskCount();
        let $taskTemplate = $(".taskTemplate")

        for (let i=1; i<=taskCount; i++) {
             let task = await App.taskList.tasks(i);
             let taskId = task[0].toNumber();
             let taskContent = task[1];
             let taskComplete = task[2];
            console.log(taskId, taskContent, taskComplete);
            let $newTask = $taskTemplate.clone();
            $newTask.prop("style", "unset")
            $newTask.find(".content").html(taskContent);
            $newTask.find("input").prop("name", taskId).prop("checked", taskComplete);

            if (taskComplete) {
                $('#completedTaskList').append($newTask);
            } else {
                $('#tasks').append($newTask)
            }
        }
    },

    createTask: async () => {
        App.setLoading(true);

        let content = $('#newTask').val();
        await App.taskList.createTask(content, {from: App.account});

        window.location.reload();
    }

},


$(() => {
  $(window).load(() => {
    App.load()
  })
})