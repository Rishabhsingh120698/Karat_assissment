const fruits = ["Apple", "Banana", "Mango", "Orange", "Grapes"];
const numbers = [10, 20, 30, 40, 50];

// 1. Add Pineapple
fruits.push("Pineapple");
console.log("1:", fruits);

// 2. Remove last fruit
fruits.pop();
console.log("2:", fruits);

// 3. Add Watermelon at beginning
fruits.unshift("Watermelon");
console.log("3:", fruits);

// 4. Remove first fruit
fruits.shift();
console.log("4:", fruits);

// 5. Slice from index 1 to 3
const slicedFruits = fruits.slice(1, 4);
console.log("5:", slicedFruits);

// 6. Remove Mango
let mangoIndex = fruits.indexOf("Mango");
fruits.splice(mangoIndex, 1);
console.log("6:", fruits);

// 7. Add Kiwi at index 2
fruits.splice(2, 0, "Kiwi");
console.log("7:", fruits);

// 8. Replace Banana with Papaya
let bananaIndex = fruits.indexOf("Banana");
fruits.splice(bananaIndex, 1, "Papaya");
console.log("8:", fruits);

// 9. Combine arrays using concat
const moreFruits = ["Guava", "Pineapple"];
const combined = fruits.concat(moreFruits);
console.log("9:", combined);

// 10. Check Mango exists
console.log("10:", fruits.includes("Mango"));

// 11. Find index of Orange
console.log("11:", fruits.indexOf("Orange"));

// 12. Last index of Apple in duplicate array
const duplicateFruits = ["Apple", "Banana", "Apple", "Orange"];
console.log("12:", duplicateFruits.lastIndexOf("Apple"));

// 13. First number greater than 25
console.log("13:", numbers.find(num => num > 25));

// 14. Index of first number greater than 25
console.log("14:", numbers.findIndex(num => num > 25));

// 15. Print every fruit
console.log("15:");
fruits.forEach(fruit => console.log(fruit));

// 16. Uppercase fruits
const upperFruits = fruits.map(fruit => fruit.toUpperCase());
console.log("16:", upperFruits);

// 17. Fruits with name length > 5
const longFruits = fruits.filter(fruit => fruit.length > 5);
console.log("17:", longFruits);

// 18. At least one number > 40
console.log("18:", numbers.some(num => num > 40));

// 19. All numbers > 5
console.log("19:", numbers.every(num => num > 5));

// 20. Length of fruit names
const lengths = fruits.map(fruit => fruit.length);
console.log("20:", lengths);

// 21. Sort fruits alphabetically
console.log("21:", [...fruits].sort());

// 22. Sort numbers ascending
console.log("22:", [...numbers].sort((a, b) => a - b));

// 23. Sort numbers descending
console.log("23:", [...numbers].sort((a, b) => b - a));

// 24. Reverse fruits
console.log("24:", [...fruits].reverse());

// 25. Convert fruits to string
console.log("25:", fruits.join(","));