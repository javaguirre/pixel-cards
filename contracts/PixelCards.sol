//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Whitelist.sol";


contract PixelCards is ERC721URIStorage, Ownable, Whitelist {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;

    string prerevealUri = "https://gateway.pinata.cloud/ipfs/123456";
    bool isRevealed = false;

    uint public whitelistPrice = 0.000001 ether;
    uint public publicPrice = 0.000002 ether;
    bool public isPublicSale = false;

    uint16 public tokenLimitCount = 2000;
    uint8 public totalTokensPerWallet = 5;

    string private _baseTokenURI;

    constructor() ERC721("PixelCards", "PXC") {}

    function _baseURI() override internal view virtual returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        _baseTokenURI = _newBaseURI;
    }

    function setIsPublicSale(bool _isPublic) external onlyOwner {
        isPublicSale = _isPublic;
    }

    function totalSupply() public view returns (uint256) {
        return tokenLimitCount - _tokenIds.current();
    }

    function setIsRevealed(bool _isRevealed) external onlyOwner {
        isRevealed = _isRevealed;
    }

    function tokenURI(uint256 tokenId)
        public view override returns (string memory)
    {
        if (!isRevealed) {
            return prerevealUri;
        }

        return super.tokenURI(tokenId);
    }

    function mintToken(address _recipient, string memory _tokenURI)
        public payable inWhitelist(_recipient)
    {
        require(
            _tokenIds.current() <= tokenLimitCount,
            "The NFT is closed, we reached the limit"
        );
        require(
            balanceOf(_recipient) < totalTokensPerWallet,
            "You have reach the token limit, can't buy more for now");
        require(
            msg.value >= getTokenPrice(),
            "Not enough ETH sent; check the price!");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _safeMint(_recipient, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        payable(owner()).transfer(msg.value);
    }

    function getTokenPrice() public view returns (uint) {
        if (!isPublicSale) {
            return whitelistPrice;
        }

        return publicPrice;
    }

    function equals(string memory a, string memory b) public pure returns (bool) {
        if(bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
        }
    }
}
