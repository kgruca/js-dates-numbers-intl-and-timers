'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = function(movements, sort = false) {

  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov, i) {

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} 
        ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};


const calcDisplayBalance = function(account) {
  account.balance = account.movements.reduce((arr, mov) => arr + mov, 0);
  labelBalance.textContent = `${account.balance}€`;
};


const calcDisplaySummary = function(account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = `${out}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (account) {
  // Display movements
  displayMovements(account.movements);

  // Display balance
  calcDisplayBalance(account);

  // Display summary 
  calcDisplaySummary(account);
}


// const user = 'Steven Thomas Williams';
// want to convert this to lower-case initials (stw)
// const username = user.toLowerCase().split(' ').map(name => 
// name[0]).join('');
// console.log(username);

// now make a function from this

const createUsernames = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};
createUsernames(accounts);


// Event handlers for login

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting 
  e.preventDefault();
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`; 
    containerApp.style.opacity = 100;

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // update the user's UI
    updateUI(currentAccount);
  }
});


// event handler for money transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);

  // clear transfer amt and receiver from input fields
  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && 
    receiverAccount &&
    currentAccount.balance >= amount && 
    receiverAccount?.username !== currentAccount.username) {
      // doing the transfer
      currentAccount.movements.push(-amount);
      receiverAccount.movements.push(amount);
  }

  // update the user's UI
  updateUI(currentAccount);

});


// even handler to request a loan from the bank
// let's say bank has a rule: loan is granted if there's at least
// one deposit that's at least 10% of the requested loan amount
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  
  const amount = +inputLoanAmount.value;
  if(amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)){
    // add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  // cleat the input field
  inputLoanAmount.value = '';
});



// event handler to close account
btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  // check that username and pin match the current user + pin
  if (inputCloseUsername.value === currentAccount.username &&
     +inputClosePin.value === currentAccount.pin) {

    // find the index of the current user in the accounts array
    const index = accounts.findIndex(acc => acc.username === 
      currentAccount.username);

    // delete that user from the array
    accounts.splice(index, 1);

    // hide the UI 
    containerApp.style.opacity = 0;
  }

  // clear the input fields for the "Close Account" section
  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


// NEW SECTION

// sqrt()
console.log(Math.sqrt(25));
// logs 5
console.log(25 ** (1 / 2));
// also logs 5

// max()
console.log(Math.max(1, 4, 67, 34));
// logs 67
// works on strings too
console.log(Math.max(1, 4, '67', 34));
// logs 67 still
// but if try:
console.log(Math.max(1, 4, '67px', 34));
// logs NaN

// min()
console.log(Math.min(1, 4, '67', 34));
// logs 1

// Math.PI
console.log(Math.PI * Number.parseFloat('10px') ** 2);
// logs 314.1592653589793

// better way to generate random numbers:
const randomInt = (min, max) => 
  Math.floor(Math.random() * (max - min) + 1) + min;

console.log(randomInt(10, 20));

// rounding integers
console.log(Math.trunc(23.3));
// logs 23
console.log(Math.round(23.3));
// logs 23
console.log(Math.round(23.9));
// logs 24

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));
// both log 24

console.log(Math.floor(23.3));
console.log(Math.floor(23.9));
// both log 23

// all of these methods do type-conversion:
console.log(Math.round('23.3'));
// logs 23

// both floor and trunc cut off the decimal when dealing with 
// positive numbers. Different for negative nums
console.log(Math.trunc(-23.3));
// logs -23
console.log(Math.floor(-23.3));
// logs -24


/*
// NEW SECTION
// all numbers are represented as floating point numbers in JS
// (no matter if they were written as integers)

console.log(23 === 23.0);
// logs true

// all numbers in JS are in binary, which makes for some really difficult
// computations. This is why sometimes you get very weird results:
console.log(0.1 + 0.2);
// should be 0.3 but logs 0.30000000000000004

// this system is also used by languages such as php and ruby
// therefore, cannot do precise (scientific, etc) calculations in languages
// such as these. Another example:
console.log(0.1 + 0.2 === 0.3);
// logs false 
// this is a quirk of JS that we just need to accept

// type conversions to numbers:
console.log(Number('23'));
// logs 23
console.log(+'23');
// logs 23

// Parsing
console.log(Number.parseInt('30px', 10));
// logs 30

console.log(Number.parseInt('e23', 10));
// logs NaN because it wasn't able to get rid of the "e"

// useful in situations such as when we get a value + unit from CSS and 
// need to get rid of the unit

// the '10' parameter lets the function know that the value passed in is 
// base-10, which helps avoid bugs
// if using binary, then you pass in '2' instead, etc

// there is also parseFloat:
console.log(Number.parseFloat('2.5rem'));
// logs 2.5

// if use parseInt on the value above, then:
console.log(Number.parseInt('2.5rem'));
// logs 2

// white space is ignored

// parseInt() and parseFloat() are actually global functions, which means
// they can be passed in without the Number keyword - modern JS usage, however,
// encourages to add Number
// Number provides a 'namespace' for these functions

// isNaN() can be used to check if something is a NaN or not
console.log(Number.isNaN(20));
// logs false
console.log(Number.isNaN('20'));
// logs false, because '20' is a string, not a NaN

// this will work more if you're trying to convert something to a number
console.log(Number.isNaN(+'e20'));
// logs true

// what about for something like 30 / 0?
// 30 / 0 would be a special value - "Infinity":
console.log(30 / 0);
// logs Infinity
console.log(Number.isNaN(30 / 0));
// logs false
// so for this situation, there's a better method:
console.log(Number.isFinite(30 / 0));
// logs false 
console.log(Number.isFinite(20));
// logs true
// but can also be used to check if something is a number or not:
console.log(Number.isFinite('20'));
// logs false

// isFinite() is better to use than isNaN()
// isFinite() is the best way to check if something is a number

// Number.isNaN() should be used to check if a number is NaN
// Number.isFinite() should be used to check if a floating point is a num
// Number.isInteger() should be used to check if an num is an int

console.log(Number.isInteger(23));
// logs true
console.log(Number.isInteger(23.0));
// logs true
console.log(Number.isInteger(23 / 0));
// logs false
*/