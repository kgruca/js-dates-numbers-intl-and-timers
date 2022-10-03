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
    '2022-10-01T17:01:17.194Z',
    '2022-10-02T03:36:17.929Z',
    '2022-10-03T10:51:36.790Z',
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
    '2022-09-30T12:01:20.894Z',
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

const formatMovementDate = function(date) {
  const calcDaysPassed = (date1, date2) => Math.round(
      Math.abs(date2 - date1) / (1000* 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if(daysPassed === 0) return `Today`;
  if(daysPassed === 1) return `Yesterday`;
  if(daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

const displayMovements = function(account, sort = false) {

  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : account.movements;

  movs.forEach(function(mov, i) {

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(account.movementsDates[i]);

    const displayDate = formatMovementDate(date);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} 
        ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};


const calcDisplayBalance = function(account) {
  account.balance = account.movements.reduce((arr, mov) => arr + mov, 0);
  labelBalance.textContent = `${account.balance.toFixed(2)}€`;
};


const calcDisplaySummary = function(account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = `${out.toFixed(2)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const updateUI = function (account) {
  // Display movements
  displayMovements(account);

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

// FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;


btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting 
  e.preventDefault();
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`; 
    containerApp.style.opacity = 100;

    // create current date and time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minute = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;

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
    
      // add transer date
      currentAccount.movementsDates.push(new Date()).toISOString;
      receiverAccount.movementsDates.push(new Date()).toISOString;

      // update the user's UI
      updateUI(currentAccount);
    }

});


// even handler to request a loan from the bank
// let's say bank has a rule: loan is granted if there's at least
// one deposit that's at least 10% of the requested loan amount
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  
  // can change the code below to
  // const amount = +inputLoanAmount.value;
  const amount = Math.floor(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)){
    // add movement
    currentAccount.movements.push(amount);

    // loan date
    currentAccount.movementsDates.push(new Date()).toISOString();

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
// operations with dates

// can subtract two dates from each other, to find the amount of time between 
// the two dates

// function to accept two dates and calc the time betweent the two dates
// const calcDaysPassed = (date1, date2) => (date2 - date1) / 
//   (1000* 60 * 60 * 24);

// console.log(calcDaysPassed(new Date(2037, 3, 14), new Date(2039, 7, 21))); 
// // logs 859 (in days)





/*
// NEW SECTION
// create a date
const now = new Date();
console.log(now);
// logs Fri Sep 30 2022 15:21:49 GMT-0700 (Pacific Daylight Time)
// ^as of the time of execution

// can do something like
console.log(new Date('Fri Sep 30 2022 15:21:49'));
// logs Fri Sep 30 2022 15:21:49 GMT-0700 (Pacific Daylight Time)

// can also put in less data and JS will provide more:
console.log(new Date('December 24, 2007'));
// logs Mon Dec 24 2007 00:00:00 GMT-0800 (Pacific Standard Time)

// can create a date this way:
console.log(new Date(2037, 10, 19, 15, 23, 5));
// logs Thu Nov 19 2037 15:23:05 GMT-0800 (Pacific Standard Time)
// this also shows that the month is zero-based

// JS will also correct mistakes:
console.log(new Date(2037, 10, 33));
// which would correspond to November 33rd, 2037...
// BUT logs Thu Dec 03 2037 00:00:00 GMT-0800 (Pacific Standard Time)
// since November has only 30 days

// passing the value of 0 will give the time of the creation of Unix time
// which is a useful tool for certain operations
console.log(new Date(0));
// logs Wed Dec 31 1969 16:00:00 GMT-0800 (Pacific Standard Time)
// so following the logic of this, you can calculate the date provided in 
// time from the start of this date, such as 3 days after this:
console.log(new Date(3 * 24 * 60 * 60 * 1000));
// days * hours/day * minutes/hr * seconds/min * ms/second
// logs Sat Jan 03 1970 16:00:00 GMT-0800 (Pacific Standard Time)

// working with dates
const future = new Date(2037, 10, 19, 15, 23, 5);
// some methods::
console.log(future.getFullYear());
// logs 2037
// never use getYear(), but getFullYear()
console.log(future.getMonth());
// logs 10 - remember that this is 0-based, so 10 == November
console.log(future.getDate());
// returns day, logs 19
console.log(future.getDay());
// returns day of the week, logs 4 
// which is Thursday
console.log(future.getMinutes());
// logs 23
console.log(future.getSeconds());
// logs 5
console.log(future.toISOString());
// logs 2037-11-19T23:23:05.000Z
console.log(future.getTime());
// logs the time (in ms) since Wed Dec 31 1969 16:00:00 GMT-0800 
// (Pacific Standard Time)
// so, logs 2142285785000 
// can also use this amount of time to find the date since the date(0):
console.log(new Date(2142285785000));
// logs Thu Nov 19 2037 15:23:05 GMT-0800 (Pacific Standard Time)

future.setFullYear(2040);
console.log(future);
// logs Mon Nov 19 2040 15:23:05 GMT-0800 (Pacific Standard Time)
// so the set methods change an aspect of the original date variable


// NEW SECTION
//BigInt

// a special kind of Int that was introduced in 2020

// biggest number that JS can safely represent:
console.log(2 ** 53 - 1);
// logs 9007199254740991
// this num is so important that it's saved into the Number namespace:
console.log(Number.MAX_SAFE_INTEGER);
// logs 9007199254740991

// with numbers larger than these, can lose precision. For example:
console.log(2 ** 53);
// logs 9007199254740992
console.log(2 ** 53 + 1);
// also logs 9007199254740992

// the way around this is to use BigInt:
console.log(234923749749857203434083218401);
// logs 2.3492374974985722e+29
// not be as precise
// but using the BigInt notation:
console.log(234923749749857203434083218401n);
// logs 234923749749857203434083218401n

// can also use the BigInt() function:
console.log(BigInt(234923749749857203434083218401));
// logs 234923749749857218861849378816n
// not as accurate as adding "n" - should probably be used with smaller numbers
// looks like JS still needs to do some conversion when using BigInt()

// operators

console.log(10000n + 10000n);
// logs 20000n
console.log(495873457983459835873459849385n * 10000000000n);
// logs 4958734579834598358734598493850000000000n

// but cannot mix BigInt with regular numbers
const huge = 98709874984375891475897459847598n;
const regular = 3456;
// console.log(huge * regular);
// Uncaught TypeError: Cannot mix BigInt and other types, 
// use explicit conversions

// some exceptions: when using the comparison operator, and when using "+"
// with strings
console.log(8987987938749372498n > 15);
// logs true

// but
console.log(20n === 20);
// logs false
// happens because JS doesn't do type coersion when using ===
console.log(typeof 20n);
// logs bigint

// but should work with ==
console.log(20n == 20);
// logs true

console.log(huge + ' is really big!!!');
// logs 98709874984375891475897459847598 is really big!!!

// cannot use the Math functions
// console.log(Math.sqrt(16n));
// Uncaught TypeError: Cannot convert a BigInt value to a number
// at Math.sqrt

// Divisions
console.log(10n / 3n);
// logs 3n
console.log(10 / 3);
// logs 3.3333333333333335


// NEW SECTION
// numeric separators
const diameterSolarSystem = 287_460_000_000;
console.log(diameterSolarSystem);
// logs 287460000000

const price = 345_99;
console.log(price);
// logs 34599

// numeric separators just make it easy for us to read, without
// causing problems for JS

// can't use in certain ways
// such as when converting to a number
console.log(+'23_000');
// logs NaN

// const PI = _3.14;
// causes syntax error
 
// console.log(45__0000);
// logs Uncaught SyntaxError: Only one underscore is allowed 
// as numeric separator

// don't do this with data received from APIs - JS will not be able to 
// parse this correctly

// be careful with situations such as the following - this can introduce bugs:
console.log(parseFloat('230_000'));
// logs 230


// NEW SECTION
// REMAINDER operator - MODULO
console.log(5 % 2);
// logs 1

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].
  forEach(function(row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
  });
});

// let's say we want to call every second row from the movements list
;


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

// rounding decimals
console.log((2.7).toFixed(0));
// logs 3
console.log((2.7).toFixed(3));
// logs 2.700
console.log((2.346).toFixed(2));
// logs 2.35

// toFixed() returns a string, so to convert the above results, simply add +
console.log(+(2.7).toFixed(0));
// logs 3 (in purple - white color means string, purple means num)


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