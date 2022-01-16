// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";

contract HoloApe is ERC721, ERC721Enumerable, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    ERC721 public apeToken = ERC721(0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D);
    mapping(uint256 => uint256) public apeToHolo;
    mapping(uint256 => uint256) public holoToApe;

    constructor() ERC721("HoloApe", "HAPE") {}

    function mintWrap(address to, uint256 apeTokenId) public {
        require(msg.sender == apeToken.ownerOf(apeTokenId), "You do not own this ape");
        require(apeToHolo[apeTokenId] == 0, "Ape already wrapped");
        
        // 0 is reserved for unmapped apeToHolo
        uint256 tokenId = 1 + _tokenIdCounter.current();
        apeToHolo[apeTokenId] = tokenId;
        holoToApe[tokenId] = apeTokenId;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        //string memory uri = 'ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/3650';
        //_setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) override(ERC721) public view returns (string memory) {
      string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "HoloApe", "description": "", "image": "ipfs://QmaaZafjApH2HG3DACwbocumS7DWwUqZoXJ91jY1cWgsgZ/', Strings.toString(holoToApe[tokenId]), '.png", "attributes": [{"trait_type":"Parent","value":', Strings.toString(holoToApe[tokenId]), '}]}'))));
      return string(abi.encodePacked('data:application/json;base64,', json));
    }
    /*
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    */

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

