const { assertRevert } = require('openzeppelin-solidity/test/helpers/assertRevert');
const { parseNumber, parseString, parseJSON } = require('./helpers/bignumberUtils');
const { sendTransaction } = require('openzeppelin-solidity/test/helpers/sendTransaction');

const Guru = artifacts.require('Guru');

contract('Guru', function(accounts) {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const TRANSFER_DATA = web3.toHex('test');
  const TOKEN_FALLBACK = 'tokenFallback(address,uint256,bytes)';
  const creator = accounts[0];
  let token;

  beforeEach('create a new token contract instance', async function() {
    this.token = await Guru.new({ from: creator });
  });

  describe('initial', function() {
    it('sets the token name', async function() {
      assert.equal(parseString(await this.token.name()), 'GURU');
    });

    it('sets the token symbol', async function() {
      assert.equal(parseString(await this.token.symbol()), 'GURU');
    });

    it('sets the token decimals', async function() {
      assert.equal(parseNumber(await this.token.decimals()), 0);
    });

    it("doesn't issue initial tokens", async function() {
      assert.equal(parseNumber(await this.token.totalSupply()), 0);
    });
  });

  describe('balanceOf', function() {
    beforeEach('mint a token', async function() {
      await this.token.mint(accounts[0], 1, { from: creator });
    });

    context('when the specified address owns some tokens', function() {
      it('returns its owned tokens amount', async function() {
        assert.equal(parseNumber(await this.token.balanceOf(accounts[0])), 1);
      });
    });

    context("when the specified address doesn't own any tokens", function() {
      it('returns 0', async function() {
        assert.equal(parseNumber(await this.token.balanceOf(accounts[1])), 0);
      });
    });

    context('when zero address specified', function() {
      it('reverts', async function() {
        await assertRevert(this.token.balanceOf(ZERO_ADDRESS));
      });
    });
  });

  describe('allowance', function() {
    beforeEach('mint and approve a token', async function() {
      await this.token.mint(accounts[0], 1, { from: creator });
      await this.token.approve(accounts[1], 1, { from: accounts[0] });
    });

    context('when the specified accounts approval exists', function() {
      it('returns the spending tokens amount', async function() {
        assert.equal(parseNumber(await this.token.allowance(accounts[0], accounts[1])), 1);
      });
    });

    context("when the specified accounts approval doesn't exist", function() {
      it('returns 0', async function() {
        assert.equal(parseNumber(await this.token.allowance(accounts[1], accounts[0])), 0);
      });
    });

    context('when zero address specified as a tokens owner', function() {
      it('reverts', async function() {
        await assertRevert(this.token.allowance(ZERO_ADDRESS, accounts[1]));
      });
    });

    context('when zero address specified as a tokens spender', function() {
      it('reverts', async function() {
        await assertRevert(this.token.allowance(accounts[0], ZERO_ADDRESS));
      });
    });
  });

  describe('transfer', function() {
    let logs;

    beforeEach('mint tokens', async function() {
      await this.token.mint(accounts[0], 1, { from: creator });
    });

    const transfer = function(to, data) {
      it('decreases the balance of the tokens owner', async function() {
        assert.equal(parseNumber(await this.token.balanceOf(accounts[0])), 0);
      });

      it('increases the balance of the tokens recepient', async function() {
        assert.equal(parseNumber(await this.token.balanceOf(to.toString())), 1);
      });

      it('emits a Transfer event', async function() {
        assert.equal(logs.length, 1);
        assert.equal(logs[0].event, 'Transfer');
        assert.equal(logs[0].args.from, accounts[0]);
        assert.equal(logs[0].args.to, to);
        assert.equal(parseNumber(logs[0].args.value), 1);
        assert.equal(logs[0].args.data, data);
      });
    };

    context('ERC20-compatible', function() {
      beforeEach('transfer tokens', async function() {
        const result = await this.token.transfer(accounts[1], 1, { from: accounts[0] });
        logs = result.logs;
      });

      context('when the tokens recepient is the regular account', function() {
        transfer(accounts[1], '0x');
      });

      context('when the tokens recepient is the smart contract', function() {});
    });

    context('with bytes metadata', function() {
      beforeEach('transfer tokens', async function() {
        const result = await sendTransaction(
          this.token,
          'transfer',
          'address,uint256,bytes',
          [accounts[1], 1, TRANSFER_DATA],
          { from: accounts[0] }
        );
        logs = result.logs;
      });

      context('when the tokens recepient is the regular account', function() {
        transfer(accounts[1], TRANSFER_DATA);
      });

      context('when the tokens recepient is the smart contract', function() {});
    });

    context('with custom fallback', function() {
      beforeEach('transfer tokens', async function() {
        const result = await sendTransaction(
          this.token,
          'transfer',
          'address,uint256,bytes,string',
          [accounts[1], 1, TRANSFER_DATA, TOKEN_FALLBACK],
          { from: accounts[0] }
        );
        logs = result.logs;
      });

      context('when the tokens recepient is the regular account', function() {
        transfer(accounts[1], TRANSFER_DATA);
      });

      context('when the tokens recepient is the smart contract', function() {});
    });
  });

  describe('transferFrom', function() {
    let logs;

    beforeEach('mint tokens', async function() {
      await this.token.mint(accounts[0], 1, { from: creator });
      await this.token.approve(accounts[1], 1, { from: accounts[0] });
    });

    const transferFrom = function(to, data) {
      it('decreases the balance of the tokens owner', async function() {
        assert.equal(parseNumber(await this.token.balanceOf(accounts[0])), 0);
      });

      it('increases the balance of the tokens recepient', async function() {
        assert.equal(parseNumber(await this.token.balanceOf(to.toString())), 1);
      });

      it('decreases the approval', async function() {
        assert.equal(parseNumber(await this.token.allowance(accounts[0], accounts[1])), 0);
      });

      it('emits an Approval event', async function() {
        assert.equal(logs.length, 2);
        assert.equal(logs[0].event, 'Approval');
        assert.equal(logs[0].args.owner, accounts[0]);
        assert.equal(logs[0].args.spender, accounts[1]);
        assert.equal(parseNumber(logs[0].args.value), 0);
      });

      it('emits a Transfer event', async function() {
        assert.equal(logs.length, 2);
        assert.equal(logs[1].event, 'Transfer');
        assert.equal(logs[1].args.from, accounts[0]);
        assert.equal(logs[1].args.to, to);
        assert.equal(parseNumber(logs[1].args.value), 1);
        assert.equal(logs[1].args.data, data);
      });
    };

    context('ERC20-compatible', function() {
      context('when the tokens recepient is the regular account', function() {
        beforeEach('transfer tokens', async function() {
          const result = await this.token.transferFrom(accounts[0], accounts[1], 1, {
            from: accounts[1]
          });
          logs = result.logs;
        });
        transferFrom(accounts[1], '0x');
      });

      context('when the tokens recepient is the smart contract', function() {});
    });

    context('with bytes metadata', function() {
      context('when the tokens recepient is the regular account', function() {
        beforeEach('transfer tokens', async function() {
          const result = await sendTransaction(
            this.token,
            'transferFrom',
            'address,address,uint256,bytes',
            [accounts[0], accounts[1], 1, TRANSFER_DATA],
            { from: accounts[1] }
          );
          logs = result.logs;
        });
        transferFrom(accounts[1], TRANSFER_DATA);
      });

      context('when the tokens recepient is the smart contract', function() {});
    });

    context('with custom fallback', function() {
      context('when the tokens recepient is the regular account', function() {
        beforeEach('transfer tokens', async function() {
          const result = await sendTransaction(
            this.token,
            'transferFrom',
            'address,address,uint256,bytes,string',
            [accounts[0], accounts[1], 1, TRANSFER_DATA, TOKEN_FALLBACK],
            { from: accounts[1] }
          );
          logs = result.logs;
        });
        transferFrom(accounts[1], TRANSFER_DATA);
      });

      context('when the tokens recepient is the smart contract', function() {});
    });
  });
});
