pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    uint expectedPetId = 7;
    uint expectedInvalidPetId = 20;

    address expectedOwner = address(this);

    function testUserCanAdoptPet() public {
        uint returnedId = adoption.adopt(expectedPetId);

        Assert.equal(returnedId, expectedPetId, "El Id de la mascota debe ser igual a la adoptada.");
    }

    function testGetAdopterAddressByPetId() public {
        address adopter = adoption.adopters(expectedPetId);

        Assert.equal(adopter, expectedOwner, "EL propietario de la mascota es el propio test contract");
    }

    function testGetAdoptersByPetIdInArray() public {
        address[16] memory adopters = adoption.getAdopters();

        Assert.equal(adopters[expectedPetId], expectedOwner, "Adopter esta en array de adopters");
    }
}
