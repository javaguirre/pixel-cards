// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CardFactory is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint dnaDigits = 24;
    uint dnaModulus = 10 ** dnaDigits;

    struct Card {
        uint id;
        string name;
        string description;
        uint dna;
        uint price;
    }

    uint cardCounter;
    mapping (uint => Card) public cards;

    constructor() ERC721("PixelCards", "PXC") {}

    function mintNFT(address recipient)
        public onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);

        return newItemId;
    }

    function generateCard(string memory _name, string memory _description, uint _price) public returns (uint) {
        uint randDna = _generateRandomDna(_name);
        return _createCard(_name, _description, _price, randDna);
    }

    // function _createCard(string memory _name, string memory _description, uint _price, uint _dna) private returns (uint) {
    //     uint currentCounter = cardCounter;
    //     Card memory card = Card(
    //         currentCounter,
    //         _name,
    //         _description,
    //         _dna,
    //         _price
    //     );
    //     cards[cardCounter] = card;

    //     emit NewCard(cardCounter, _name, _price, _dna);

    //     cardCounter++;

    //     return currentCounter;
    // }

    function _generateRandomDna(string memory _name) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_name)));
        return rand % dnaModulus;
    }
}

