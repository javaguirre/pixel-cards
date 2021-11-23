const CardFactory = artifacts.require('CardFactory');

module.exports = function(deployer) {
    deployer.deploy(CardFactory);
}
