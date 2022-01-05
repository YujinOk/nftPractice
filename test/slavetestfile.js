const { assert } = require("chai");
// This is my copy of the testing file, just in case any more issues pop up
// and you want something to compare with :)
const Color = artifacts.require("./Color.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Color", (accounts) => {
  let contract;

  // before hook (grabs copy of contract before any tests)
  before(async () => {
    contract = await Color.deployed();
  });

  //deployment tests
  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = contract.address;
      console.log(address);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await contract.name();
      assert.equal(name, "Color");
    });

    it("has a symbol", async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, "COLOR");
    });
  });

  describe("minting", async () => {
    it("creates a new token", async () => {
      const result = await contract.mint("#EC058E");
      const totalSupply = await contract.totalSupply();
      // SUCCESSS (confirm when we mint token, we have 1 token)
      assert.equal(totalSupply, 1);

      // This show transfer logs during minting including address of sender, transaction details
      console.log(result);

      // Has token id from and to
      const event = result.logs[0].args;

      assert.equal(event.tokenId.toNumber(), 1, "id is correct");
      assert.equal(
        event.from,
        "0x0000000000000000000000000000000000000000",
        "from is correct"
      );
      // in truffle ganache, first account is one minting
      assert.equal(event.to, accounts[0], "to is correct");

      //FAILURE : cannot mint same color twice
      await contract.mint("#EC058E").should.be.rejected;
    });

    // Other functionality in app; listing out tokens
    describe("indexing", async () => {
      it("lists colors", async () => {
        // Mint 3 more tokens
        await contract.mint("#5386E4");
        await contract.mint("#FFFFFF");
        await contract.mint("#000000");

        // This is how we will display colors on client side page
        const totalSupply = await contract.totalSupply();

        let color;
        let result = [];

        for (var i = 0; i < totalSupply; i++) {
          color = await contract.colors(i);
          result.push(color);
        }

        let expected = ["#EC058E", "#5386E4", "#FFFFFF", "#000000"];
        assert.equal(result.join(","), expected.join(","));
      });
    });
  });
});
