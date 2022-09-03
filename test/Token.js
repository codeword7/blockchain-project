const {expect} = require("chai")
const {ethers} = require("hardhat")

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe("Token", () => {
    let token;
    beforeEach(async() => {
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy("Neeraj", "NRJ", "1000000");
    })
    describe("Deployment", () => {
        const nameExp = 'Neeraj'
        const tokenExp = 'NRJ'
        const decimalsnExp = '18'
        const value = tokens(1000000);
        it("has correct name", async() => {
            const name = await token.name();
            expect(name).to.equal(nameExp);
        })
        it("has correct symbol", async() => {
            const symbol = await token.symbol();
            expect(symbol).to.equal(tokenExp);
        })
        it("has correct decimals", async() => {
            const decimals = await token.decimals();
            expect(decimals).to.equal(decimalsnExp);
        })
        it("has correct total supply", async() => {
            const totalSupply = await token.totalSupply();
            expect(totalSupply).to.equal(value);
        })
    })
})