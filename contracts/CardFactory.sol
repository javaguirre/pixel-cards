// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CardFactory {
    address payable private _owner;

    uint dnaDigits = 24;
    uint dnaModulus = 10 ** dnaDigits;

    event NewCard(uint id, string _name, uint price, uint _dna);
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

    constructor() {
        _owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    function isOwner() public view returns(bool) {
        return msg.sender == _owner;
    }

    function withdraw() external onlyOwner {
        _owner.transfer(address(this).balance);
    }

    function generateCard(string memory _name, string memory _description, uint _price) public returns (uint) {
        uint randDna = _generateRandomDna(_name);
        return _createCard(_name, _description, _price, randDna);
    }

    function _createCard(string memory _name, string memory _description, uint _price, uint _dna) private returns (uint) {
        uint currentCounter = cardCounter;
        Card memory card = Card(
            currentCounter,
            _name,
            _description,
            _dna,
            _price,
            payable(msg.sender),
            payable(0)
        );
        cards[cardCounter] = card;

        emit NewCard(cardCounter, _name, _price, _dna);

        cardCounter++;

        return currentCounter;
    }

    function _generateRandomDna(string memory _name) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_name)));
        return rand % dnaModulus;
    }

    function getCardsCounter() public view returns (uint) {
        return cardCounter;
    }

    function buyCard(uint _cardIndex) payable public {
        require(_cardIndex >= 0 && _cardIndex <= cardCounter);

        Card storage card = cards[_cardIndex];

        require(card.buyer == payable(0));
        require(msg.sender != card.seller);
        require(msg.value >= card.price);

        card.buyer = payable(msg.sender);
        card.seller.transfer(msg.value);

        emit NewCardPayment(_cardIndex);
    }
}

