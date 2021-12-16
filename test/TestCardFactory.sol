pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CardFactory.sol";

contract TestCardFactory {
    CardFactory cardFactory = CardFactory(DeployedAddresses.CardFactory());
    uint public initialBalance = 1 ether;

    function testGenerateCard() public {
        string memory name;

        cardFactory.generateCard("Pepe", "My description", 1 ether);
        (,name,,,,,) = cardFactory.cards(0);

        Assert.equal(
            name,
            "Pepe",
            "The card name should be on the list");
    }

    function testGetCardsCounter() public {
        cardFactory.generateCard("Pepe", "My description", 1 ether);

        uint counter = cardFactory.getCardsCounter();

        Assert.equal(
            counter,
            2,
            "Card counter must be 2");
    }

    // function testBuyCard() public {
    //     address payable buyerWallet;
    //     address payable wallet = payable(0xe762b6f7794f619E0c795ba21131848b6b0b1B93);
    //     cardFactory.generateCard("Pepe", "My description", 1 ether);

    //     cardFactory.buyCard{value: 1 ether}(0);
    //     (,,,,,,buyerWallet) = cardFactory.cards(0);

    //     Assert.equal(
    //         wallet,
    //         buyerWallet,
    //         "La wallet de compra deberia ser la misma que la de entrada"
    //     );
    // }
}
