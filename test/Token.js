const {expect} = require("chai")
const {ethers} = require("hardhat")

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe("Token", () => {
    let token;
    let accounts;
    let deployer;
    let receiver;
    let exchange;

    beforeEach(async() => {
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy("Neeraj", "NRJ", "1000000");
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        receiver = accounts[1];
        exchange = accounts[2];
    })
    describe("Deployment", () => {
        const nameExp = 'Neeraj'
        const tokenExp = 'NRJ'
        const decimalsnExp = '18'
        const totalSupplyExp = tokens(1000000);
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
            expect(totalSupply).to.equal(totalSupplyExp);
        })
        it("assigns total supply to deployer", async() => {
            const balance = await token.balanceOf(deployer.address);
            expect(balance).to.equal(totalSupplyExp);
        })
    })
    describe("Sending Tokens", () => {
        let amount, transaction, result;

        describe("Success", () => {
            beforeEach(async () => {
                amount = tokens(100)
                transaction = await token.connect(deployer).transfer(receiver.address , amount);
                result = await transaction.wait();
            })
            it('transfers token balances', async () => {
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
                expect(await token.balanceOf(receiver.address)).to.equal(amount)
            })
            it('emits a Transfer event', async () => {
                const event = result.events[0];
                expect(event.event).to.equal('Transfer');
    
                const args = event.args;
                expect(args.from).to.equal(deployer.address);
                expect(args.to).to.equal(receiver.address);
                expect(args.value).to.equal(amount);
            })
        })

        describe("Failure", () => {
            it('rejects insufficient balances', async () => {
                const invalidAmount = tokens(100000000);
                await expect(token.connect(deployer).transfer(receiver.address , invalidAmount)).to.be.reverted;
            })
            it('rejects invalid recipent', async () => {
                const amount = tokens(100000000);
                await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000' , amount)).to.be.reverted;
            })
        })
    })
    describe("Approving Tokens", () => {
        let amount, transaction, result;
        beforeEach(async () => {
            amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address , amount);
            result = await transaction.wait();
        })
        describe("Success", () => {
            it("allocates an allowance for delegated token spending", async() => {
                expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
            })
            it('emits a Approval event', async () => {
                const event = result.events[0];
                expect(event.event).to.equal('Approval');
    
                const args = event.args;
                expect(args.owner).to.equal(deployer.address);
                expect(args.spender).to.equal(exchange.address);
                expect(args.value).to.equal(amount);
            })
        })
        describe("Failure", () => {
            it('rejects invalid spenders', async () => {
                await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000' , amount)).to.be.reverted;
            })
        })
    })
})