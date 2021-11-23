pragma solidity ^0.5.0;

contract CardFactory {
    uint dnaDigits = 24;
    uint dnaModulus = 10 ** dnaDigits;

    event NewCard(string _name, uint price);

    struct Card {
        string name;
        string description;
        uint dna;
        uint price;
    }

    Card[] cards;

    mapping (uint => address) public cardToOwner;

    function generateCard(string memory _name, string memory _description, uint _price) public {
        uint randDna = _generateRandomDna(_name);
        _createCard(_name, _description, _price, randDna);
    }

    function _createCard(string memory _name, string memory _description, uint _price, uint _dna) private {
        uint id = cards.push(Card(_name, _description, _dna, _price)) - 1;
        cardToOwner[id] = msg.sender;
        emit NewCard(_name, _price);
    }

    function _generateRandomDna(string memory _name) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_name)));
        return rand % dnaModulus;
    }

    // TODO Get the data
    // function getCards() public view returns (Card[] memory) {
    //     return cards;
    // }
}

