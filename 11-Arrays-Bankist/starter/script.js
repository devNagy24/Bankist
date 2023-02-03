'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

/* const account5 = {
  owner: 'Devon Nagy',
  movements: [2060, 3000, -580, 2060, -1800, 2060],
  interestRate: 1.2,
  pin: 5555,
}; */

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
      <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculating + Printing balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toLocaleString(1)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// Computing Usernames With Map Method
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);
console.log(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  // Display Balance
  calcDisplayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};
//Implementing Login Feature
// Event Handlers for Login
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting (aka. reloading the page)
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI & Welcome Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear the Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);

    console.log('LOGIN');
  }
});

// Implementing Transfer

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing The Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

// Find Index Method

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount?.username &&
    Number(inputClosePin.value) === currentAccount?.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]; */

/////////////////////////////////////////////////

// Simple Array Methods

/* let arr = ['a', 'b', 'c', 'd', 'e'];

// Slice
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());

// Splice
//console.log(arr.splice(2));
console.log(arr.splice(-1));
console.log(arr);
console.log(arr.splice(1, 2));
console.log(arr);

// Reverse
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// Concat
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// Join
console.log(letters.join(' - '));
const iterator = letters.entries();
console.log(iterator.next().value);
console.log(iterator.next().value); 
 */
/* const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

// Getting last element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
// Getting last element with the "at" method
console.log(arr.at(-1));

 */

/* const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('----FOREACH-----');
// forEach Parameters = element, then index, unlike the for of loop, which is the opposite.
movements.forEach(function (movement, index, array) {
  if (movement > 0) {
    console.log(`Movement ${index}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${index}: You withdrew ${Math.abs(movement)}`);
  }
});
 */
// 0: function(200)
// 1: function(450)
// 2: function(400)

// forEach with Maps
/* const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// forEach with a Set
const currenciesUnique = new Set(['USD', 'GPB', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});
 */

// Challenge 1:
//console.log(`Julia's dogs ages: ${arr1}. Katie's dogs ages: ${arr2} `);
/*  for (const [i, age] of arr1.entries()) {
  console.log(`${i + 1}: ${age}`);
}
for (const [i, age] of arr2.entries()) {
  console.log(`${i + 1}: ${age}`);
} */
// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKatie = [4, 1, 15, 8, 3];
// const dogsJuliaCopy = dogsJulia.slice(1, 3);
// const dogsKatieCopy = dogsKatie.slice(1, 3);
// const bothDogGroups = dogsJuliaCopy.concat(dogsKatieCopy);
// const dogsJulia2 = [16, 6];
// const dogsKatie2 = [5, 6];

//bothDogGroups = dogsJulia2.concat(dogsKatie2);

/* const checkDogs = function (arr1, arr2) {
  //console.log(`Julia's dogs ages: ${arr1}. Katie's dogs ages: ${arr2} `);

  arr1.forEach(function (age, i) {
    if (age < 3) {
      console.log(`Dog number ${i + 1} is still a puppy🐶`);
    } else {
      console.log(`Dog number ${i + 1} is an adult, and is ${age} years old.`);
    }
  });
};
//checkDogs(bothDogGroups);
checkDogs(bothDogGroups); */

/* console.log(dogsJuliaCopy);
console.log(dogsKatieCopy);
console.log(bothDogGroups); */

/* const checkDogs = function (dogsJulia, dogsKatie) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);

  const dogs = dogsJuliaCorrected.concat(dogsKatie);
  console.log(dogs);

  dogs.forEach(function (age, i) {
    if (age <= 3) {
      console.log(`Dog number ${i + 1} is still a puppy🐶`);
    } else {
      console.log(`Dog number ${i + 1} is an adult, and is ${age} years old.`);
    }
  });
};
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
 */

// Data Transformations With Map, Filter, and Reduce
// Map Method= Loop over Arrays, Creates a brand new array from the original array
// Ex. const array = [1, 4, 9, 16]
//const map1 = array.map(x => x * 2)
//expected output = [2, 8, 18, 32]
// Filter: Filter through an array, then pass the test implemented by
//the provided function, stores into a new array
// Reduce: reduces all the array elements down to one single value

// Map:
//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//const euroToUsd = 1.1;

/* const movementsUsd = movements.map(function (mov) {
  return Math.trunc(mov * euroToUsd);
}); */

// Map method
/* const movementsUsd = movements.map(mov => Math.trunc(mov * euroToUsd));
console.log(movements);
console.log(movementsUsd);

// For of loop.
const movementsUsdFor = [];
for (const mov of movements) {
  movementsUsdFor.push(Math.trunc(mov * euroToUsd));
}
console.log(movementsUsdFor); */

// Regular Function
/* const toUsd = function (mov) {
  const movementsToUsd1 = [];
  for (const mov of movements) {
    movementsToUsd1.push(Math.trunc(mov * euroToUsd));
    console.log(movementsToUsd1);
  }
};
toUsd(); */

/* const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposit' : 'withdrew'} $${Math.trunc(
      Math.abs(mov * euroToUsd)
    )}`

  /*  if (mov > 0) {
    return `Movement ${i + 1}: You deposited ${mov}`;
  } else {
    return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
    ); 
  } */
//console.log(movementsDescription);

// Filter Method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/* const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});
console.log(withdrawals); */
// same as above, but with arrow function instead
// const withdrawalz = movements.filter(mov => mov < 0);
// console.log(withdrawalz);

// Using a for loop to get the same results that the filter method got.
/* const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) {
    depositsFor.push(mov);
  }
}
console.log(depositsFor); */

// Reduce Method

// arrow function with reduce
const balance = movements.reduce((acc, curr) => acc + curr, 0);
console.log(balance);

/* const reducer = movements.reduce(function (previousValue, currentValue) {
  return previousValue + currentValue;
});
console.log(reducer); */

// Accumulator --> Snowball
/* const balance = movements.reduce(function (acc, curr, i, arr) {
  console.log(`Iteration ${i}: ${acc}: ${acc + curr}`);
  return acc + curr;
}, 0);
console.log(balance); */

// Obtaining Same Result with a for.. of loop
/* let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2); */

// Maximum Value
/* console.log(Math.max(...movements));

function minMax(items) {
  return items.reduce((acc, val) => {
    acc[0] = acc[0] === undefined || val < acc[0] ? val : acc[0];
    acc[1] = acc[1] === undefined || val > acc[1] ? val : acc[1];
    return acc;
  }, []);
}
console.log(minMax(movements)); */

const max = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);
console.log(max);

// returns same value as 'max', just written shorter cause of ternary operator
const max1 = movements.reduce((acc, mov) => (acc > mov ? acc : mov));
//console.log(max1);

// Challenge 2:

/* const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAge.filter(age => age >= 18);
  const average = adults.reduce(
    (acc, age, i, arr) => acc + age / arr.length,
    0
  ); */
//const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;

// const reducer = (prev, cur, i, arr) => prev + cur / arr.length;
// const reduced = adults.reduce(reducer);
// console.log(humanAge);
// console.log(adults);
// console.log(average);
/*   return average;
};
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log('--------------');
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2); */

/* const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAges.filter(age => age >= 18);
  console.log(humanAges);
  console.log(adults);

  const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;

  /*  const average = adults.reduce(
    (acc, age, i, arr) => acc + age / arr.length,
    0
  ); */

// 2 3. (2+3)/2 = 2.5 === 2/2+3/2 = 2.5
/*
  return average;
};
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);
 */

// The Magic of Chaining Methods
// Don't overuse chaining, can lower performance use.
// You shouldnt chain the splice, or reverse method.

/* const euroToUsd = 1.1;
// PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  //.map(mov => mov * euroToUsd)
  .map((mov, i, arr) => {
    //console.log(arr);
    return mov * euroToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);

const totalWithdrawUSD = movements
  .filter(mov => mov < 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalWithdrawUSD); */

// Challenge 3
/* const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAge.filter(age => age >= 18);
  const average = adults.reduce( 
    (acc, age, i, arr) => acc + age / arr.length,
    0
)};  */
// Same function, but as a arrow function
/* const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log(`----------`);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);
 */

// The Find Method
/* const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
 */
// Challenge: Use a for of loop instead of the "find" method.
/* for (const i of accounts) {
  if (i === 'Jessica Davis') {
    console.log(i);
  }
} */

// Some and Every Method

// console.log(movements);

// EQUALITY
// console.log(movements.includes(-130));
//console.log(movements.findIndex(el => el === -130));

// CONDITION
// const anyDeposits = movements.some(mov => mov > 1500);

// console.log(anyDeposits);

// EVERY
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// SEPERATE CALLBACK
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// Flat and FlatMap

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat());
//console.log(arrDeep.flatMap());

/* const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);

const allMovements = accountMovements.flat();
console.log(allMovements);

const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance); */

// Same as above, just with chaining.

/* const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalance);
 */
// Flat Map

/* const overallBalance1 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalance1); */

// Sorting Arrays
// Strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());

// Numbers
// console.log(movements);

// return < 0, A, B ---> (keep order)
// return > 0, B, A ---> (switch order)

// ASCENDING
/* movements.sort((a, b) => {
  if (a > b) return 1;
  if (b > a) return -1;
});
console.log(movements); */

/* movements.sort((a, b) => {
  return a - b;
});
console.log(movements);
 */
// DESCENDING

/* movements.sort((a, b) => {
  if (a > b) return -1;
  if (b > a) return 1;
});
console.log(movements); */

/* movements.sort((a, b) => {
  return b - a;
});
console.log(movements); */

/* movements.sort((a, b) => {
  if (a > b) {
    return 1;
  } else if (b > a) {
    return -1;
  }
}) */

// Empty Array + Fill Methods
const arr = [1, 2, 3, 4, 5, 6, 7];

const x = new Array(7);
console.log(x);

console.log(x.map(() => 5));

x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// Array.from

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const randomDiceRolls = Array.from({ length: 100 }, () =>
  Math.floor(Math.random() * 100)
);
console.log(randomDiceRolls);

const randomArray = (length, max) =>
  [...new Array(length)].map(() => Math.round(Math.random() * max));

console.log(randomArray(1, 100));

const randomArray1 = (length, max) =>
  Array.from({ length }, () => Math.round(Math.random() * max));
console.log(randomArray1(1, 100));

const randomNumber = Array.from({ length: 1 }, () =>
  Math.floor(Math.random() * 100)
);
console.log(randomNumber);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  // Using the Spread Operator instad of "Array.from()"
  /* const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  const movementsUI3 = movementsUI2.map(el =>
    Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI3); */
});

// What array method to use  ?
// 1. To mutate original array = Add to original ? .push, .unshift.
// remove from original ? .pop, .shift, .splice.
// others? .reverse, .sort, .fill
// 2. A new array = computed from original ? .map,
// Filtered using condition? .filter
// portion of original ? .slice, adding to original to other? .concat
// flattening the original ? .flat, .flatMap
// 3. An Array Index = based on value ? .indexOf,
// based on test condition? .findIndex
// 4. An Array Element = based on test condition? .find
// 5. Know if array includes = based on value? .includes,
// based on test condition? .some, .every // ALL 3 METHODS RETURN BOOLEAN VALUES
// 6. A new string = based on seperator string? .join
// 7. To transform to value = based on accumulator? .reduce
// 8. To just loop array = based on callback ? .forEach (does not create a new array
// just loops over it.)
// ALL 23 METHODS FOR ARRAYS.

// Array Methods Practice

//1.

/* const bankDepositSum = accounts
  .map(acc => acc.movements)
  .flat()
  .filter(acc => acc > 0)
  .reduce((acc, mov) => acc + mov);

console.log(bankDepositSum); */

// With flatMap()

const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(acc => acc > 0)
  .reduce((acc, mov) => acc + mov, 0);

console.log(bankDepositSum);

// 2.
/* const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(acc => acc > 1000).length;

console.log(numDeposits1000); */

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => (mov >= 1000 ? ++acc : acc), 0);

console.log(numDeposits1000);

// Prefix ++ operator
/* let a = 10;
console.log(++a);
console.log(a);
 */

// 3. Create object that contains sums of deposits and withdrawls
// Creating a object with the reduce method.

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, curr) => {
      // curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);
      sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(`Deposits: ${deposits}, Withdrawals: ${withdrawals}`);

// 4.  Title Case function. this is a nice title = This Is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title, but not too long'));
console.log(convertTitleCase('this is another title with an EXAMPLE'));

// Challenge 4:

/* const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(function (el, i, _) {
  el.Recommended = Math.floor(el.weight ** 0.75 * 28);
  //el.Recommended = `${recFood}`;
  console.log(`Dog ${i} should eat: ${el.Recommended}`);
});
console.log(dogs);
/* dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs); */

// Same as above, but without forEach.
/* const doggoz = dogs.map(recc =>
  Object.assign({}, recc, { Recommended: Math.floor(recc.weight ** 0.75 * 28) })
);
console.log(doggoz);
 */

// 2.
/*
const dogsSarah = dogs.find(el => el.owners.includes('Sarah'));
console.log(dogsSarah);
console.log(
  `Sarahs dog is eating ${
    dogsSarah.curFood > dogsSarah.Recommended ? 'too much' : 'too little'
  } amount of food`
);

// 3.

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.Recommended)
  .flatMap(dog => dog.owners);
// .flat();
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.Recommended)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4.
console.log(`${ownersEatTooMuch.join(' and ')} eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')} eat too little!`);

// 5.
console.log(dogs.includes(dog => dog.curFood === dog.Recommended));

// 6.
const dogEatingOkay = dog =>
  dog.curFood > dog.Recommended * 0.9 && dog.curFood < dog.Recommended * 1.1;
console.log(dogs.some(dogEatingOkay));

// 7.
//dogs.filter(dogEatingOkay());
console.log(dogs.filter(dogEatingOkay));

// 8.
const filteredDogs = dogs.slice().sort((a, b) => {
  return a.Recommended - b.Recommended;
});
 */

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

// 2. current > (recommended * 0.90) && current < (recommended * 1.10)
const sarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating ${
    sarahsDog.curFood > sarahsDog.recFood ? 'too much' : 'too little'
  }.`
);

// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4.
console.log(`${ownersEatTooMuch.join(' and ')} dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')} dogs eat too little!`);

// 5.
const rightAmount = dogs.some(dog => dog.curFood === dog.recFood);
console.log(rightAmount);

// 6. current > (recommended * 0.90) && current < (recommended * 1.10)
const checkDog = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

console.log(dogs.some(checkDog));

// 7.
const eatingOkay = dogs.filter(checkDog);
console.log(eatingOkay);

// 8.
const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);
