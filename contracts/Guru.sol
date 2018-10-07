pragma solidity ^0.4.24;

import "./IERC223.sol";
import "openzeppelin-solidity/contracts/ownership/Contactable.sol";
import "openzeppelin-solidity/contracts/AddressUtils.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


/**
 * @title GURU ERC223 token implementation
 * @author rjkz808
 */
contract Guru is IERC223, Contactable {
  using AddressUtils for address;
  using SafeMath for uint256;

  string internal constant name_ = "GURU";
  string internal constant symbol_ = "GURU";
  uint8 internal constant decimals_ = 0;
  string internal constant tokenFallback = "tokenFallback(address,uint256,bytes)";
  uint256 public totalSupply;
  address public teamFund;
  address[] public admins;

  mapping (address => uint256) internal balances;
  mapping (address => mapping (address => uint256)) internal allowed;

  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
  );
  event Mint(address indexed to, uint256 amount);

  /**
   * @dev Constructor sets the initial contract parameters
   * @param _teamFund address the team fund
   */
  constructor(address _teamFund) public {
    require(_teamFund != address(0));
    teamFund = _teamFund;
  }

  /**
   * @dev Gets the token name
   * @return string the token name
   */
  function name() public view returns (string) {
    return name_;
  }

  /**
   * @dev Gets the token short code
   * @return string the token symbol
   */
  function symbol() public view returns (string) {
    return symbol_;
  }

  /**
   * @dev Gets the token divisibility value
   * @return uint8 the token decimals
   */
  function decimals() public view returns (uint8) {
    return decimals_;
  }

  /**
   * @dev Gets the total amount of tokens in circulation
   * @return uint256 the total supply
   */
  function totalSupply() public view returns (uint256) {
    return totalSupply;
  }

  /**
   * @dev Gets an account tokens balance
   * @param _who address
   * @return uint256 the account owned tokens amount
   */
  function balanceOf(address _who) public view returns (uint256) {
    require(_who != address(0));
    return balances[_who];
  }

  /**
   * @dev Gets
   */
  function allowance(address _owner, address _spender)
    public view returns (uint256)
  {
    require(_owner != address(0));
    require(_spender != address(0));
    return allowed[_owner][_spender];
  }

  /**
   * @dev Function to get the all administrators list
   * @return address[] the administrators list
   */
  function getAdmins() public view returns (address[]) {
    return admins;
  }

  /**
   * @dev ERC20-compatible function to send tokens
   * @param _to address the tokens recepient
   * @param _value uint256 amount of the tokens to be sent
   * @return bool the transaction state
   */
  function transfer(address _to, uint256 _value) public returns (bool) {
    return transfer(_to, _value, "");
  }

  /**
   * @dev Function to send tokens
   * @param _to address the tokens recepient
   * @param _value uint256 amount of the tokens to be sent
   * @param _data bytes the transaction metadata
   * @return bool the transaction state
   */
  function transfer(address _to, uint256 _value, bytes _data)
    public returns (bool)
  {
    return transfer(_to, _value, _data, tokenFallback);
  }

  /**
   * @dev Function to send tokens wit the custom fallback call
   * @param _to address the tokens recepient
   * @param _value uint256 amount of the tokens to be sent
   * @param _data bytes the transaction metadata
   * @param _customFallback string the fallback function name to be called
   * @return bool the transaction state
   */
  function transfer(
    address _to,
    uint256 _value,
    bytes _data,
    string _customFallback
  )
    public
    returns (bool)
  {
    require(_to != address(0));
    require(_value <= balances[msg.sender]);

    balances[_to] = balances[_to].add(_value);
    balances[msg.sender] = balances[msg.sender].sub(_value);
    _callFallback(msg.sender, _to, _value, _data, _customFallback);

    emit Transfer(msg.sender, _to, _value, _data);
    return true;
  }

  /**
   * @dev Function to send the approved tokens
   * @param _from address the tokens owner
   * @param _to address the tokens recepient
   * @param _value uint256 amount of the tokens to be sent
   * @return bool the transaction state
   */
  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  )
    public
    returns (bool)
  {
    return transferFrom(_from, _to, _value, "");
  }

  /**
   * @dev Function to send the approved tokens
   * @param _from address the tokens owner
   * @param _to address the tokens recepient
   * @param _value uint256 amount of the tokens to be sent
   * @param _data bytes the transaction metadata
   * @return bool the transaction state
   */
  function transferFrom(
    address _from,
    address _to,
    uint256 _value,
    bytes _data
  )
    public
    returns (bool)
  {
    return transferFrom(_from, _to, _value, _data, tokenFallback);
  }

  /**
   * @dev Function to send the approved tokens
   * @param _from address the tokens owner
   * @param _to address the tokens recepient
   * @param _value uint256 amount of the tokens to be sent
   * @param _data bytes the transaction metadata
   * @param _customFallback string the fallback function name to be called
   * @return bool the transaction state
   */
  function transferFrom(
    address _from,
    address _to,
    uint256 _value,
    bytes _data,
    string _customFallback
  )
    public
    returns (bool)
  {
    require(_from != address(0));
    require(_to != address(0));
    require(_value <= allowed[_from][msg.sender]);

    balances[_to] = balances[_to].add(_value);
    balances[_from] = balances[_from].sub(_value);
    allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
    _callFallback(_from, _to, _value, _data, _customFallback);

    emit Approval(_from, msg.sender, allowed[_from][msg.sender]);
    emit Transfer(_from, _to, _value, _data);
    return true;
  }

  /**
   * @dev Function to approve an account to spend tokens
   * @param _spender address the tokens spender
   * @param _value uint256 amount of the tokens to be approved
   */
  function approve(address _spender, uint256 _value) public {
    require(_spender != address(0));
    require(_value <= balances[msg.sender]);
    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
  }

  /**
   * @dev Function to increase the spending tokens amount of an account
   * @param _spender address the tokens spender
   * @param _value uint256 amount of the tokens to be added
   */
  function increaseApproval(address _spender, uint256 _value) public {
    require(_spender != address(0));
    require(allowed[msg.sender][_spender].add(_value) <= balances[msg.sender]);
    allowed[msg.sender][_spender] = allowed[msg.sender][_spender].add(_value);
    emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
  }

  /**
   * @dev Function to decrease the spending tokens amount of an account
   * @param _spender address the tokens spender
   * @param _value uint256 amount of the tokens to be substracted
   */
  function decreaseApproval(address _spender, uint256 _value) public {
    require(_spender != address(0));
    require(_value <= allowed[msg.sender][_spender]);
    allowed[msg.sender][_spender] = allowed[msg.sender][_spender].sub(_value);
    emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
  }

  /**
   * @dev Function to issue new tokens
   * @param _value uint256 amount of the tokens to be issued
   */
  function mint(uint256 _value) public onlyOwner {
    totalSupply = totalSupply.add(_value);
    balances[owner] = balances[owner].add(_value);
    transfer(teamFund, _value.div(100).mul(5));
    emit Mint(owner, _value);
  }

  /**
   * @dev Function to add a new account to the admins list
   * @param _admin address the administrator
   */
  function addAdmin(address _admin) public onlyOwner {
    require(_admin != address(0));
    admins.push(_admin);
  }

  /**
   * @dev Internal function to call the fallback function if the tokens
   * @dev recepient is the smart contract
   * @param _from address the tokens owner
   * @param _to address the tokens recepient
   * @param _value uint256 amount of the tokens to be sent
   * @param _data bytes the transaction metadata
   * @param _fallback string the fallback function name to be called
   */
  function _callFallback(
    address _from,
    address _to,
    uint256 _value,
    bytes _data,
    string _fallback
  )
    internal
  {
    if (_to.isContract()) {
      require(_to.call.value(0)(
        bytes4(keccak256(abi.encode(_fallback))),
        _from,
        _value,
        _data
      ), "incorrect function call");
    }
  }

}
