const { assert } = require("console");

const CardFactory = artifacts.require('CardFactory')

contract("CardFactory", accounts => {
    it("Should generate the first card", async () =>
      CardFactory.deployed()
        .then(instance => instance.generateCard(
            "Pepe", "description", 1, {from: accounts[0]}))
        .then(result => {
            assert(result.tx)
        })
    );

    it("Should getcards counter", () =>
      CardFactory.deployed()
        .then(instance => instance.getCardsCounter.call())
        .then(counter => {
            assert(counter.toNumber() === 1)
        })
    );

    it("Should get the first card", () =>
      CardFactory.deployed()
        .then(instance => instance.cards(0))
        .then(card => {
            assert(card.name === 'Pepe')
        })
    );

    it("Should be false if the account is not owner", () =>
      CardFactory.deployed()
        .then(instance => instance.isOwner({from: accounts[1]}))
        .then(isOwner => assert(!isOwner))
    );

    it("Should be true if the account is the owner", () =>
      CardFactory.deployed()
        .then(instance => instance.isOwner({from: accounts[0]}))
        .then(isOwner => assert(isOwner))
    );

    it("If not owner then we don't get balance", () =>
      CardFactory.deployed()
        .then(instance => instance.getBalance({from: accounts[1]}))
        .catch(error => assert(error.message))
    );

    it("If owner I can get the balance", () =>
      CardFactory.deployed()
        .then(instance => instance.getBalance({from: accounts[0]}))
        .then(balance => assert(balance.toNumber() === 0))
    );

    it("Should withdraw with the owner account", () =>
      CardFactory.deployed()
        .then(instance => instance.withdraw({from: accounts[0]}))
        .then(result => assert(result))
    );

    it("Shouldn't withdraw with another account", () =>
      CardFactory.deployed()
        .then(instance => instance.withdraw({from: accounts[1]}))
        .catch(error => assert(error.message))
    );

    it("Shouldn't buy card if it's mine", () =>
      CardFactory.deployed()
        .then(instance => instance.buyCard(0, {from: accounts[0], value: 1}))
        .catch(error => assert(error.message))
    );

    it("Can't buy a card if the price not right", () =>
      CardFactory.deployed()
        .then(instance => instance.buyCard(0, {from: accounts[1], value: 0}))
        .catch(error => assert(error.message))
    );

    it("Can buy a card it it's not mine", () =>
      CardFactory.deployed()
        .then(instance => instance.buyCard(0, {from: accounts[1], value: 1}))
        .then(result => assert(result))
    );

    it("Can see I'm the buyer when I get the card bought", () =>
      CardFactory.deployed()
        .then(instance => instance.cards(0))
        .then(card => {
            assert(card.buyer === accounts[1])
        })
    );

    it("I get balance when the buyer buys with more than the card value", () => {
      CardFactory.deployed()
        .then(instance => instance.generateCard(
            "Pepe", "description", 1, {from: accounts[0]}))
        .then(result => assert(result));
      CardFactory.deployed()
        .then(instance => instance.buyCard(1, {from: accounts[1], value: 1.5}))

      CardFactory.deployed()
        .then(instance => instance.getBalance({from: accounts[0]}))
        .then(balance => assert(balance === 0.5))
    });
});
