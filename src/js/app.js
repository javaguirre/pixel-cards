App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    $.getJSON('../cards.json', function(data) {
      var cardsRow = $('#cardsRow');
      var cardTemplate = $('#cardTemplate');

      for (i = 0; i < data.length; i ++) {
        cardTemplate.find('.card-title').text(data[i].name);
        cardTemplate.find('img').attr('src', data[i].avatar);
        cardTemplate.find('.card-id').text(data[i].id);
        cardTemplate.find('.card-price').text(data[i].price);
        cardTemplate.find('.card-description').text(data[i].description);
        cardTemplate.find('.btn-buy').attr('data-id', data[i].id);

        cardsRow.append(cardTemplate.html());
      }
    });
    console.log('Init');

    return await App.initWeb3();
  },

  initWeb3: async function() {
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
    /* $.getJSON('Adoption.json' , function(data) {
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      App.contracts.Adoption.setProvider(App.web3Provider);

      return App.markAdopted();
    }); */

    return App.bindEvents();
  },

  bindEvents: function() {
    console.log('Events');
    // $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  /* markAdopted: function() {
    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if(adopters[i] !== '0x0000000000000000000000000000000000000000') {
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
  } */

};

$(function() {
  $(window).on("load", function() {
    App.init();
  });
});
