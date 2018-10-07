const { assertRevert } = require('openzeppelin-solidity/test/helpers/assertRevert');
const { parseNumber, parseString, parseJSON } = require('./helpers/bignumberUtils');
const { sendTransaction } = require('openzeppelin-solidity/test/helpers/sendTransaction');

const Guru = artifacts.require('Guru');

contract('Guru', function(accounts) {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const TRANSFER_DATA = web3.toHex('test');
  const TOKEN_FALLBACK = 'tokenFallback(address,uint256,bytes)';
  const creator = accounts[0];
  const teamFund = accounts[3];

  let token;

  beforeEach('create a new token contract instance', async function() {
    this.token = await Guru.new(accounts[3], { from: creator });
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

    it('creates empty administrators array', async function() {
      assert.equal(parseJSON(await this.token.getAdmins()), '[]');
    });

    it("doesn't issue initial tokens", async function() {
      assert.equal(parseNumber(await this.token.totalSupply()), 0);
    });
  });

  describe('balanceOf', function() {
    beforeEach('mint a token', async function() {
      await this.token.mint(1, { from: creator });
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
      await this.token.mint(1, { from: creator });
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
      await this.token.mint(1, { from: creator });
    });

    const transfer = function(to, data) {
      context('when successfull', function() {
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
      });
    };

    context('ERC20-compatible', function() {
      context('when the tokens recepient is the regular account', function() {
        beforeEach('transfer tokens', async function() {
          const result = await sendTransaction(
            this.token,
            'transfer',
            'address,uint256',
            [accounts[1], 1],
            { from: accounts[0] }
          );
          logs = result.logs;
        });

        transfer(accounts[1], '0x');

        context('when zero address specified', function() {
          it('reverts', async function() {
            await assertRevert(
              sendTransaction(this.token, 'transfer', 'address,uint256', [ZERO_ADDRESS, 1], {
                from: accounts[0]
              })
            );
          });
        });

        context("when the msg.sender doesn't own the specified tokens amount", function() {
          it('reverts', async function() {
            await assertRevert(
              sendTransaction(this.token, 'transfer', 'address,uint256', [accounts[1], 2], {
                from: accounts[0]
              })
            );
          });
        });
      });

      context('when the tokens recepient is the smart contract', function() {});
    });

    context('with bytes metadata', function() {
      context('when the tokens recepient is the regular account', function() {
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

        transfer(accounts[1], TRANSFER_DATA);

        context('when zero address specified', function() {
          it('reverts', async function() {
            await assertRevert(
              sendTransaction(
                this.token,
                'transfer',
                'address,uint256,bytes',
                [ZERO_ADDRESS, 1, TRANSFER_DATA],
                {
                  from: accounts[0]
                }
              )
            );
          });
        });

        context("when the msg.sender doesn't own the specified tokens amount", function() {
          it('reverts', async function() {
            await assertRevert(
              sendTransaction(
                this.token,
                'transfer',
                'address,uint256,bytes',
                [accounts[1], 2, TRANSFER_DATA],
                {
                  from: accounts[0]
                }
              )
            );
          });
        });
      });

      context('when the tokens recepient is the smart contract', function() {});
    });

    context('with custom fallback', function() {
      context('when the tokens recepient is the regular account', function() {
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

        transfer(accounts[1], TRANSFER_DATA);

        context('when zero address specified', function() {
          it('reverts', async function() {
            await assertRevert(
              sendTransaction(
                this.token,
                'transfer',
                'address,uint256,bytes,string',
                [ZERO_ADDRESS, 1, TRANSFER_DATA, TOKEN_FALLBACK],
                {
                  from: accounts[0]
                }
              )
            );
          });
        });

        context("when the msg.sender doesn't own the specified tokens amount", function() {
          it('reverts', async function() {
            await assertRevert(
              sendTransaction(
                this.token,
                'transfer',
                'address,uint256,bytes,string',
                [accounts[1], 2, TRANSFER_DATA, TOKEN_FALLBACK],
                {
                  from: accounts[0]
                }
              )
            );
          });
        });
      });

      context('when the tokens recepient is the smart contract', function() {});
    });
  });

  describe('transferFrom', function() {
    let logs;

    beforeEach('mint tokens', async function() {
      await this.token.mint(1, { from: creator });
      await this.token.approve(accounts[1], 1, { from: accounts[0] });
    });

    const transferFrom = function(to, data) {
      context('when successfull', function() {
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
      });
    };

    context('ERC20-compatible', function() {
      context('when the tokens recepient is a regular account', function() {
        beforeEach('transfer tokens', async function() {
          const result = await this.token.transferFrom(accounts[0], accounts[1], 1, {
            from: accounts[1]
          });
          logs = result.logs;
        });

        transferFrom(accounts[1], '0x');

        context('when zero address specified as a tokens owner', function() {
          it('reverts', async function() {
            await assertRevert(
              this.token.transferFrom(ZERO_ADDRESS, accounts[1], 1, {
                from: accounts[1]
              })
            );
          });
        });

        context('when zero address specified as a tokens recepient', function() {
          it('reverts', async function() {
            await assertRevert(
              this.token.transferFrom(accounts[0], ZERO_ADDRESS, 1, {
                from: accounts[1]
              })
            );
          });
        });

        context(
          'when the msg.sender is not allowed to spend the specified tokens amount',
          function() {
            it('reverts', async function() {
              await assertRevert(
                this.token.transferFrom(accounts[0], accounts[1], 2, {
                  from: accounts[1]
                })
              );
            });
          }
        );
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

        context('when zero address specified as a tokens owner', function() {
          it('reverts', async function() {
            await assertRevert(
              sendTransaction(
                this.token,
                'transferFrom',
                'address,address,uint256,bytes',
                [ZERO_ADDRESS, accounts[1], 1, TRANSFER_DATA],
                { from: accounts[1] }
              )
            );
          });
        });

        context('when zero address specified as a tokens recepient', function() {
          it('reverts', async function() {
            await assertRevert(
              sendTransaction(
                this.token,
                'transferFrom',
                'address,address,uint256,bytes',
                [accounts[0], ZERO_ADDRESS, 1, TRANSFER_DATA],
                { from: accounts[1] }
              )
            );
          });
        });

        context(
          'when the msg.sender is not allowed to spend the specified tokens amount',
          function() {
            it('reverts', async function() {
              await assertRevert(
                sendTransaction(
                  this.token,
                  'transferFrom',
                  'address,address,uint256,bytes',
                  [accounts[0], accounts[1], 2, TRANSFER_DATA],
                  { from: accounts[1] }
                )
              );
            });
          }
        );
      });

      context('when the tokens recepient is a smart contract', function() {});
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

        context('when zero address specified as a tokens owner', function() {
          it('reverts', async function() {
            await assertRevert(
              sendTransaction(
                this.token,
                'transferFrom',
                'address,address,uint256,bytes,string',
                [ZERO_ADDRESS, accounts[1], 1, TRANSFER_DATA, TOKEN_FALLBACK],
                { from: accounts[1] }
              )
            );
          });
        });

        context('when zero address specified as a tokens recepient', function() {
          it('reverts', async function() {
            await assertRevert(
              sendTransaction(
                this.token,
                'transferFrom',
                'address,address,uint256,bytes,string',
                [accounts[0], ZERO_ADDRESS, 1, TRANSFER_DATA, TOKEN_FALLBACK],
                { from: accounts[1] }
              )
            );
          });
        });

        context(
          'when the msg.sender is not allowed to spend the specified tokens amount',
          function() {
            it('reverts', async function() {
              await assertRevert(
                sendTransaction(
                  this.token,
                  'transferFrom',
                  'address,address,uint256,bytes,string',
                  [accounts[0], accounts[1], 2, TRANSFER_DATA, TOKEN_FALLBACK],
                  { from: accounts[1] }
                )
              );
            });
          }
        );
      });

      context('when the tokens recepient is the smart contract', function() {});
    });
  });

  describe('approval', function() {
    let logs;

    const approve = function(state, value) {
      context('when successfull', function() {
        it(state + ' the approval value to ' + value.toString(), async function() {
          assert.equal(parseNumber(await this.token.allowance(accounts[0], accounts[1])), value);
        });

        it('emits an Approval event', async function() {
          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Approval');
          assert.equal(logs[0].args.owner, accounts[0]);
          assert.equal(logs[0].args.spender, accounts[1]);
          assert.equal(parseNumber(logs[0].args.value), value);
        });
      });
    };

    beforeEach('mint tokens', async function() {
      await this.token.mint(1, { from: creator });
    });

    context('set', function() {
      beforeEach('approve tokens', async function() {
        const result = await this.token.approve(accounts[1], 1, { from: accounts[0] });
        logs = result.logs;
      });

      approve('sets', 1);

      context('when zero address specified', function() {
        it('reverts', async function() {
          await assertRevert(this.token.approve(ZERO_ADDRESS, 1, { from: accounts[0] }));
        });
      });

      context("when the msg.sender doesn't own the specified tokens amount", function() {
        it('reverts', async function() {
          await assertRevert(this.token.approve(accounts[1], 2, { from: accounts[0] }));
        });
      });
    });

    context('increase', function() {
      beforeEach('approve tokens', async function() {
        const result = await this.token.increaseApproval(accounts[1], 1, { from: accounts[0] });
        logs = result.logs;
      });

      approve('increases', 1);

      context('when zero address specified', function() {
        it('reverts', async function() {
          await assertRevert(
            this.token.increaseApproval(ZERO_ADDRESS, 1, {
              from: accounts[0]
            })
          );
        });
      });

      context(
        "when the msg.sender doesn't own the exists approval + specified tokens amount",
        function() {
          it('reverts', async function() {
            await assertRevert(
              this.token.increaseApproval(accounts[1], 2, {
                from: accounts[0]
              })
            );
          });
        }
      );
    });

    context('decrease', function() {
      beforeEach('approve tokens', async function() {
        await this.token.approve(accounts[1], 1, { from: accounts[0] });
        const result = await this.token.decreaseApproval(accounts[1], 1, { from: accounts[0] });
        logs = result.logs;
      });

      approve('decreases', 0);

      context('when zero address specified', function() {
        it('reverts', async function() {
          await assertRevert(
            this.token.decreaseApproval(ZERO_ADDRESS, 1, {
              from: accounts[0]
            })
          );
        });
      });

      context('when the specified subtract value is bigger than the exists approval', function() {
        it('reverts', async function() {
          await assertRevert(
            this.token.decreaseApproval(accounts[1], 2, {
              from: accounts[0]
            })
          );
        });
      });
    });
  });

  describe('mint', function() {
    let logs;

    beforeEach('mint tokens', async function() {
      const result = await this.token.mint(100, { from: creator });
      logs = result.logs;
    });

    context('when successfull', function() {
      it('increases the total supply', async function() {
        assert.equal(parseNumber(await this.token.totalSupply()), 100);
      });

      it('increases the balance of the minter', async function() {
        assert.equal(parseNumber(await this.token.balanceOf(creator)), 95);
      });

      it('transfers the team percent to the teamFund', async function() {
        it('increases the balance of the team fund', async function() {
          assert.equal(parseNumber(await this.token.balanceOf(teamFund)), 1);
        });

        it('emits a Transfer event', async function() {
          assert.equal(logs.length, 2);
          assert.equal(logs[0].event, 'Transfer');
          assert.equal(logs[0].args.from, creator);
          assert.equal(logs[0].args.to, teamFund);
          assert.equal(parseNumber(logs[0].args.value), 5);
          assert.equal(logs[0].args.data, '0x');
        });
      });

      it('emits a Mint event', async function() {
        assert.equal(logs.length, 2);
        assert.equal(logs[1].event, 'Mint');
        assert.equal(logs[1].args.to, creator);
        assert.equal(parseNumber(logs[1].args.amount), 100);
      });
    });

    context("when the msg.sender isn't owner", function() {
      it('reverts', async function() {
        await assertRevert(this.token.mint(100, { from: accounts[1] }));
      });
    });
  });

  describe('addAdmin', function() {
    beforeEach('mint tokens', async function() {
      await this.token.addAdmin(accounts[4], { from: creator });
    });

    context('when successfull', function() {
      it('adds an administrator address to the admins array', async function() {
        assert.equal(parseJSON(await this.token.getAdmins()), '["' + accounts[4] + '"]');
      });
    });

    context('when zero address specified', function() {
      it('reverts', async function() {
        await assertRevert(this.token.addAdmin(ZERO_ADDRESS, { from: creator }));
      });
    });

    context("when the msg.sender isn't owner", function() {
      it('reverts', async function() {
        await assertRevert(this.token.addAdmin(accounts[4], { from: accounts[1] }));
      });
    });
  });
});
