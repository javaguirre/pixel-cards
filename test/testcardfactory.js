const { assert } = require("console");

const CardFactory = artifacts.require('CardFactory')

contract("CardFactory", accounts => {
    it("Should generate the first card", () =>
      CardFactory.deployed()
        .then(instance => instance.generateCard(
            "Pepe", "description", 1, {from: accounts[0]}))
        .then(result => {
            assert(result)
        })
    );

    it("Should getcards counter", () =>
      CardFactory.deployed()
        .then(instance => instance.getCardsCounter.call())
        .then(counter => {
            assert(counter === 1)
        })
    );

    it("Should get the first card", () =>
      CardFactory.deployed()
        .then(instance => instance.cards(0))
        .then(card => {
            assert(card.name === 'Pepe')
        })
    );

    it("Should withdraw with the owner account", () =>
      CardFactory.deployed()
        .then(instance => instance.withdraw({from: accounts[0]}))
        .then(result => assert(result))
    );

    it("Shouldn't withdraw with another account", () =>
      CardFactory.deployed()
        .then(instance => instance.withdraw({from: accounts[1]}))
        .catch(error => assert(error))
    );

    it("Shouldn't buy card if it's mine", () =>
      CardFactory.deployed()
        .then(instance => instance.buyCard(0, {from: accounts[0], value: 1}))
        .catch(error => assert(error))
    );

    it("Can buy a card it it's not mine", () =>
      CardFactory.deployed()
        .then(instance => instance.buyCard(0, {from: accounts[1], value: 1}))
        .then(result => assert(result))
    );


});
