const fruits = [
  { id: 1, name: "Apple", price: 100, quantity: 10 },
  { id: 2, name: "Banana", price: 40, quantity: 20 },
  { id: 3, name: "Mango", price: 150, quantity: 5 },
  { id: 4, name: "Orange", price: 80, quantity: 15 },
  { id: 5, name: "Grapes", price: 120, quantity: 8 }
];

// 1. Display fruit names
fruits.forEach(fruit => console.log(fruit.name));

// 2. Array of fruit names
const fruitNames = fruits.map(fruit => fruit.name);
console.log(fruitNames);

// 3. Fruits with price > 100
const costlyFruits = fruits.filter(fruit => fruit.price > 100);
console.log(costlyFruits);

// 4. First fruit with quantity > 10
const fruit = fruits.find(fruit => fruit.quantity > 10);
console.log(fruit);