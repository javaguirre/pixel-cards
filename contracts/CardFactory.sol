pragma solidity ^0.5.0;

contract CardFactory {
    uint dnaDigits = 24;
    uint dnaModulus = 10 ** dnaDigits;

    event NewCard(string _name, uint price, uint _dna);
    event NewCardPayment(uint _cardIndex);

    struct Card {
        uint id;
        string name;
        string description;
        uint dna;
        uint price;
        address payable seller;
        address payable buyer;
    }

    uint cardCounter;
    mapping (uint => Card) public cards;

    function generateCard(string memory _name, string memory _description, uint _price) public {
        uint randDna = _generateRandomDna(_name);
        _createCard(_name, _description, _price, randDna);
    }

    function _createCard(string memory _name, string memory _description, uint _price, uint _dna) private {
        cardCounter++;
        cards[cardCounter] = Card(
            cardCounter,
            _name,
            _description,
            _dna,
            _price,
            msg.sender,
            0x0000000000000000000000000000000000000000
        );

        emit NewCard(_name, _price, _dna);
    }

    function _generateRandomDna(string memory _name) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_name)));
        return rand % dnaModulus;
    }

    function getCardsCounter() public view returns (uint) {
        return cardCounter;
    }

    function buyCard(uint _cardIndex) payable public {
        require(_cardIndex > 0 && _cardIndex <= cardCounter);

        Card storage card = cards[_cardIndex];

        require(card.buyer == 0x0000000000000000000000000000000000000000);
        require(msg.sender != card.seller);
        require(msg.value == card.price);

        card.buyer = msg.sender;
        card.seller.transfer(msg.value);

        emit NewCardPayment(_cardIndex);
    }
}

