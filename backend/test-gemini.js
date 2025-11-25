
function sumArray(numbers) {
  // Input validation: Check if the input is an array
  if (!Array.isArray(numbers)) {
    console.error("Error: Input must be an array.");
    return 0; // Return 0 or throw an error based on desired error handling
  }

  // Initialize a variable to store the sum
  let totalSum = 0;

  // Iterate over each number in the array
  for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];

    // Input validation: Check if the current element is a number
    if (typeof number !== 'number' || isNaN(number)) {
      console.warn(`Warning: Non-numeric value found at index ${i}. Skipping this value.`);
      continue; // Skip non-numeric values
    }

    // Add the current number to the total sum
    totalSum += number;
  }

  // Return the calculated total sum
  return totalSum;
}

// --- Examples of how to use the sumArray function ---

// Example 1: Summing an array of positive numbers
const numbers1 = [1, 2, 3, 4, 5];
const result1 = sumArray(numbers1);
console.log(`Sum of [${numbers1}] is: ${result1}`); // Expected: 15

// Example 2: Summing an array with negative numbers and zero
const numbers2 = [10, -5, 0, 7, -2];
const result2 = sumArray(numbers2);
console.log(`Sum of [${numbers2}] is: ${result2}`); // Expected: 10

// Example 3: Summing an empty array
const numbers3 = [];
const result3 = sumArray(numbers3);
console.log(`Sum of [${numbers3}] is: ${result3}`); // Expected: 0

// Example 4: Summing an array with a single number
const numbers4 = [42];
const result4 = sumArray(numbers4);
console.log(`Sum of [${numbers4}] is: ${result4}`); // Expected: 42

// Example 5: Summing an array with non-numeric values (will log warnings and skip them)
const numbers5 = [1, 'hello', 3, null, 5, undefined, 7, NaN];
const result5 = sumArray(numbers5);
console.log(`Sum of [${numbers5}] is: ${result5}`); // Expected: 16 (1+3+5+7)

// Example 6: Calling with a non-array input (will log an error)
const result6 = sumArray("not an array");
console.log(`Sum of "not an array" is: ${result6}`); // Expected: 0 (due to error handling)

// Example 7: Using reduce for a more concise (but less explicit error handling) approach
/**
 * Calculates the sum of all numbers in an array using Array.prototype.reduce().
 * This version is more concise but assumes valid numeric input or handles non-numbers
 * by converting them to 0 if they are not strictly numbers.
 *
 * @param {number[]} numbers - An array of numbers to be summed.
 * @returns {number} The total sum of the numbers in the array.
 */
function sumArrayWithReduce(numbers) {
  // Input validation: Check if the input is an array
  if (!Array.isArray(numbers)) {
    console.error("Error (reduce version): Input must be an array.");
    return 0;
  }

  // Use the reduce method to sum the numbers
  // The accumulator `acc` stores the running total.
  // The current value `num` is added to the accumulator.
  // The initial value of the accumulator is 0.
  return numbers.reduce((acc, num) => {
    // Ensure that only numbers are added. If a non-number is encountered,
    // it's treated as 0 for the sum, but a warning is logged.
    if (typeof num !== 'number' || isNaN(num)) {
      console.warn(`Warning (reduce version): Non-numeric value found: ${num}. Treating as 0.`);
      return acc; // Skip non-numeric values
    }
    return acc + num;
  }, 0);
}

const numbersReduce = [10, 20, 'test', 30, null, 40];
const resultReduce = sumArrayWithReduce(numbersReduce);
console.log(`Sum of [${num