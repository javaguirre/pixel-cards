App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
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
    $('#create-card-button').click(function(e) {
      e.preventDefault();

      const name = $('input[name="name"]').val();
      const description = $('input[name="description"]').val();
      const price = $('input[name="price"]').val();

      App.createCard(name, description, price);
    });

    $(document).on('click', '.btn-buy', function(e) {
      const cardId = $(this).data('id');
      const cardPrice = $(this).data('price');
      App.buyCard(cardId, cardPrice);
    });
  },

  createCard: function(name, description, price) {
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

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

  buyCard: function(cardIndex, cardPrice) {
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.CardFactory.deployed().then(function(instance) {
        cardInstance = instance;
        console.log(cardPrice);

        return cardInstance.buyCard(
          cardIndex, {from: account, value: web3.toWei(cardPrice, 'ether')});
      }).then(function(result) {
        return App.updateCardList();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  updateCardList: function() {
    App.contracts.CardFactory.deployed().then(function(instance) {
      cardInstance = instance;
      return cardInstance.getCardsCounter.call();
    }).then(function(counter) {
      // TODO Provisional
      // TODO Mostrar solo los nuevos
      var cardsRow = $('#cardsRow');
      var cardTemplate = $('#cardTemplate');
      $('#cardsRow').empty();

      for(let index = 0; index < counter; index++) {
        App.contracts.CardFactory.deployed().then(function(instance) {
          cardInstance = instance;
          return cardInstance.cards.call(index);
        }).then(function(card) {

          cardTemplate.find('.card-title').text(card[1]);
          cardTemplate.find('img').attr('src', `https://avatars.dicebear.com/api/human/${card[3]}.svg`);
          cardTemplate.find('.card-id').text(card[0]);
          cardTemplate.find('.card-price').text(card[4]);
          cardTemplate.find('.card-description').text(`${card[2]} Seller: ${card[5]} Buyer: ${card[6]}`);
          cardTemplate.find(
            '.btn-buy'
          ).attr(
            'data-id', card[0]
          ).attr('data-price', card[4]);

          cardsRow.append(cardTemplate.html());
        });
      }
    });
  },
};

$(function() {
  $(window).on("load", function() {
    App.init();
  });
});
