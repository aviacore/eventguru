pragma solidity ^0.4.9;

/**
 * @title New ERC223 contract interface
 */
contract IERC223 {
  function name() public view returns (string _name);
  function symbol() public view returns (string _symbol);
  function decimals() public view returns (uint8 _decimals);
  function totalSupply() public view returns (uint256 _supply);
  function balanceOf(address who) public view returns (uint256);

  function transfer(address to, uint256 value) public returns (bool ok);
  function transfer(address to, uint256 value, bytes data)
    public returns (bool ok);
  function transfer(
    address to,
    uint256 value,
    bytes data,
    string custom_fallback
  ) public returns (bool ok);

  event Transfer(
    address indexed from,
    address indexed to,
    uint256 value,
    bytes data
  );
}
