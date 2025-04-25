const { toTitleCase, groupBy, isValidEmail, memoize } = require('../utils');

function runTests() {
  testToTitleCase();
  testGroupBy();
  testIsValidEmail();
  testMemoize();
  
  console.log('All tests passed!');
}

function testToTitleCase() {
  const testCases = [
    { input: 'hello world', expected: 'Hello World' },
    { input: 'HELLO WORLD', expected: 'Hello World' },
    { input: 'hElLo WoRlD', expected: 'Hello World' },
    { input: 'hello-world', expected: 'Hello-world' },
    { input: '', expected: '' }
  ];
  
  for (const { input, expected } of testCases) {
    const result = toTitleCase(input);
    assert(result === expected, `toTitleCase('${input}') returned '${result}', expected '${expected}'`);
  }
}

function testGroupBy() {
  const people = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 30 },
    { name: 'Dave', age: 25 }
  ];
  
  const groupedByAge = groupBy(people, 'age');
  
  assert(Object.keys(groupedByAge).length === 2, 'Should have 2 age groups');
  assert(groupedByAge[30].length === 2, 'Should have 2 people aged 30');
  assert(groupedByAge[25].length === 2, 'Should have 2 people aged 25');
  assert(groupedByAge[30][0].name === 'Alice', 'First person aged 30 should be Alice');
}

function testIsValidEmail() {
  const validEmails = [
    'test@example.com',
    'test.name@example.com',
    'test+name@example.com',
    'test@sub.example.com'
  ];
  
  const invalidEmails = [
    'testexample.com',
    'test@',
    '@example.com',
    'test@example',
    'test@.com',
    'test@example..com'
  ];
  
  for (const email of validEmails) {
    assert(isValidEmail(email), `Email '${email}' should be valid`);
  }
  
  for (const email of invalidEmails) {
    assert(!isValidEmail(email), `Email '${email}' should be invalid`);
  }
}

function testMemoize() {
  let callCount = 0;
  
  function expensiveFunction(a, b) {
    callCount++;
    return a + b;
  }
  
  const memoizedFn = memoize(expensiveFunction);
  
  assert(memoizedFn(1, 2) === 3, 'First call should return 3');
  assert(callCount === 1, 'Function should have been called once');
  
  assert(memoizedFn(1, 2) === 3, 'Second call with same args should return 3');
  assert(callCount === 1, 'Function should not have been called again');
  
  assert(memoizedFn(2, 3) === 5, 'Call with different args should return 5');
  assert(callCount === 2, 'Function should have been called again with new args');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

module.exports = { runTests };

if (require.main === module) {
  runTests();
}
