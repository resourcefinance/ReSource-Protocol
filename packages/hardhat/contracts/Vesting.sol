// pragma solidity 0.4.23;

// import '@orderbook/smart-contracts-common/contracts/SafeMath.sol';
// import './Owned.sol';
// import './ERC20Interface.sol';

// /**
//  * @title Vesting
//  *
//  * This contract serves as a distributor of vesting.
//  *
//  * User can create a vesting for a person which will get payments by parts separated in time.
//  * These are parts of vesting:
//  * - receiver is a person who will get payments.
//  * - ERC20 is a token which will serve as a payment.
//  * - amount of tokens paid in a single part.
//  * - parts is amount of payout parts.
//  * - paymentInterval is how long receiver have to wait between payouts.
//  * - schedule is the date from which first payment interval counting starts.
//  * - sendings is how many parts user have already got. Increases after every payout.
//  *
//  * The formula to calculate payouts is: schedule + paymentInterval * sendings.
//  *
//  * SafeMath is used to prevent overflow.
//  */

// contract Vesting is Owned {
//     using SafeMath for uint;

//     /* solhint-disable var-name-mixedcase*/
//     struct Vestings {
//         address receiver;
//         ERC20Interface ERC20;
//         uint amount;
//         uint parts;
//         uint paymentInterval;
//         uint schedule;
//         uint sends;
//     }
//     /* solhint-enable var-name-mixedcase*/

//     mapping (address => uint) public vestingBalance;
//     mapping (address => mapping (address => uint)) public receiverVestings;

//     Vestings[] public vestings;

//     event VestingCreated(
//         address sender,
//         address receiver,
//         address ERC20,
//         uint amount,
//         uint id,
//         uint parts,
//         uint paymentInterval,
//         uint schedule
//     );

//     event VestingSent(address receiver, address ERC20, uint amount, uint id, uint sends);
//     event ReceiverChanged(uint id, address from, address to);

//     function createVesting(
//         address _receiver,
//         ERC20Interface _ERC20,
//         uint _amount,
//         uint _parts,
//         uint _paymentInterval,
//         uint _schedule
//     ) public returns(bool) {
//         uint intervalsCount = _paymentInterval.mul(_parts);
//         uint vestingPeriod = _schedule.add(intervalsCount);
//         uint value = _amount.mul(_parts);

//         require(_receiver != 0x0);
//         require(_parts > 0 && _amount > 0 && _parts <= 10000);

//         //vesting shouldn't last more than 5 years.
//         // solhint-disable-next-line not-rely-on-time
//         require(vestingPeriod <= ((365 * 5 days) + now));
//         require(_ERC20.transferFrom(msg.sender, address(this), value));

//         vestings.push(Vestings(_receiver, _ERC20, _amount, _parts, _paymentInterval, _schedule, 0));
//         vestingBalance[_ERC20] = vestingBalance[_ERC20].add(value);
//         receiverVestings[_receiver][_ERC20] = receiverVestings[_receiver][_ERC20].add(value);

//         emit VestingCreated(
//             msg.sender,
//             _receiver,
//             _ERC20,
//             _amount,
//             (vestings.length - 1),
//             _parts,
//             _paymentInterval,
//             _schedule
//         );

//         return true;
//     }

//     function sendVesting(uint _id) public returns(bool) {
//         Vesting.Vestings storage vesting = vestings[_id];
//         // solhint-disable-next-line not-rely-on-time
//         require(now >= (vesting.schedule + vesting.paymentInterval * (vesting.sends + 1)));
//         require(vesting.ERC20.transfer(vesting.receiver, vesting.amount));

//         emit VestingSent(
//             vesting.receiver,
//             vesting.ERC20,
//             vesting.amount,
//             _id,
//             vesting.sends
//         );

//         vestingBalance[vesting.ERC20] -= vesting.amount;
//         receiverVestings[vesting.receiver][vesting.ERC20] -= vesting.amount;
//         vestings[_id].sends++;

//         if (vesting.sends == vesting.parts) {
//             delete vestings[_id];
//         }

//         return true;
//     }

//     function changeReceiver(uint _id, address _newReceiver) public returns(bool) {
//         require(_newReceiver != 0x0);
//         require(msg.sender == vestings[_id].receiver);

//         vestings[_id].receiver = _newReceiver;
//         emit ReceiverChanged(_id, msg.sender, _newReceiver);
//         return true;
//     }

//     function withdrawExtraTokens(ERC20Interface _ERC20) public onlyContractOwner() returns(bool) {
//         require(_ERC20.transfer(contractOwner, getExtraTokens(_ERC20)));
//         return true;
//     }

//     function getVesting(uint _id)
//         public
//         view
//         returns(address, address, uint, uint, uint, uint, uint)
//     {
//         return (
//             vestings[_id].receiver,
//             vestings[_id].ERC20,
//             vestings[_id].amount,
//             vestings[_id].parts,
//             vestings[_id].paymentInterval,
//             vestings[_id].schedule,
//             vestings[_id].sends
//         );
//     }

//     function getExtraTokens(ERC20Interface _ERC20) public view returns(uint) {
//         return (_ERC20.balanceOf(this) - vestingBalance[_ERC20]);
//     }
// }
