javascript /** * Calculates the sum of an arbitrary number of numeric arguments. * * @param {...number} numbers - A variable number of numeric arguments to be summed. * @returns {number} The sum of all provided numbers. Returns 0 if no numbers are provided. */ function sum(...numbers) { // Check if any numbers are provided to avoid unnecessary iteration if (numbers.length === 0) { return 0; }

// Use the reduce method to sum all numbers in the array // 'accumulator' stores the running total, 'currentValue' is the current number being added return numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0); }

// --- Examples of usage ---

// Example 1: Summing positive numbers console.log("Sum of 1, 2, 3:", sum(1, 2, 3)); // Expected output: 6

// Example 2: Summing positive and negative numbers console.log("Sum of 10, -5, 2:", sum(10, -5, 2)); // Expected output: 7

// Example 3: Summing a single number console.log("Sum of 7:", sum(7)); // Expected output: 7

// Example 4: Summing no numbers (edge case) console.log("Sum of no numbers:", sum()); // Expected output: 0

// Example 5: Summing with floating-point numbers console.log("Sum of 1.5, 2.5, 3:", sum(1.5, 2.5, 3)); // Expected output: 7

// Example 6: Using with an array (requires spread operator) const numbersArray = [4, 5, 6]; console.log("Sum of array [4, 5, 6]:", sum(...numbersArray)); // Expected output: 15

// Example 7: Handling non-numeric input (will result in NaN if not handled internally, // but the function assumes numeric input based on typical use cases for 'sum') // console.log("Sum with non-numeric:", sum(1, 'a', 3)); // This would result in NaN // For robust error handling, you might add type checks inside the function if non-numeric input is expected.

