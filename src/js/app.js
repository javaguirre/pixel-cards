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
    $.getJSON('CardFactory.json' , function(data) {
      var CardFactoryArtifact = data;
      App.contracts.CardFactory = TruffleContract(CardFactoryArtifact);
      App.contracts.CardFactory.setProvider(App.web3Provider);

      return App.updateCardList();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    console.log('Events');
    // $(document).on('click', '.btn-adopt', App.handleAdopt);
    $('#create-card-button').click(function(e) {
      e.preventDefault();
      const name = $('input[name="name"]').val();
      const description = $('input[name="description"]').val();
      const price = $('input[name="price"]').val();
      console.log(`Name: ${name} description: ${description} price: ${price}`);
      App.createCard(name, description, price);
    });
  },

  createCard: function(name, description, price) {
    console.log('Carta creada!');

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      console.log(`ACCOUNT: ${account}`);

      App.contracts.CardFactory.deployed().then(function(instance) {
        cardInstance = instance;
        return cardInstance.generateCard(
          name, description, price, {from: account});
      }).then(function(result) {
        return App.updateCardList();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  buyCard: function() {
    // TODO Tomar el ID de la carta actual
    // TODO Elegir la cuenta de ETH que va a pagar
    // TODO Llamar al smart contract con el value de la carta
  },

  updateCardList: function() {
    // TODO Mostrar las cartas nuevas
    console.log('Updated!');
  }
};

$(function() {
  $(window).on("load", function() {
    App.init();
  });
});
