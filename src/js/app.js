App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });
    console.log('Init');

    return await App.initWeb3();
  },

  initWeb3: async function() {
    /*
     * Replace me...
     */
    console.log('Web3');

    if (window.ethereum) {
      App.web3Provider = window.ethereum;

      try {
        await window.ethereum.request({ method: "eth_requestAccounts"});
      } catch(error) {
        alert('You need to give access in order to use the site!');
      }
    } else {
      alert('You need to have Metamask installed and enabled');
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json' , function(data) {
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      App.contracts.Adoption.setProvider(App.web3Provider);

      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function() {
    /*
     * Replace me...
     */
    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      return adoptionInstance.getAdopters().call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if(adopters[i] !== '0x0') {
          $('.panel-pet').eq(i).find(
            'button'
          ).text('Ya esta adoptado').attr('disabled', true);
        }
      }
    }).catch(function(error) {
      console.log(error.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      console.log(`ACCOUNT: ${account}`);

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        return adoptionInstance.adopt(petId, {from: account})
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
