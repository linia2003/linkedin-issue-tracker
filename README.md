1️⃣ What is the difference between var, let, and const?
ans:var can be accessed outside of blocks like if statements or loops. Because of this, it can accidentally create bugs. while let is the way to declare variables that may change later. It only works inside the { } where it was created. so if we create a let variable inside a loop, it won’t exist outside that loop. const is used when the value should not be reassigned later.so if we store something like an API link or a fixed configuration value, const is usually the best choice.
2️⃣ What is the spread operator (...)?
ans:It is used when we want copy elements from arrays or objects. This is very useful when we want to combine things or copy data without changing the original.
3️⃣ What is the difference between map(), filter(), and forEach()?
ans:map() is used when we want to change each item of an array and create a new array from the results. filter() on the other hand is used when we want to select only the items that match a certain condition, and it returns a new array with those items. forEach() is mainly used when we just want to run something for every item in the array and it does not create a new array.
4️⃣ What is an arrow function?
ans:Arrow function is a shorter and cleaner way to write functions in JavaScript using the => symbol. It helps make the code easier to reads. Its often used in  array methods like map() or filter().
5️⃣ What are template literals?
ans:Template literals are a way to write strings in JavaScript using backticks ( ) instead of normal quotes. They allow inserting variables directly inside a string and also write multi-line text more easily.
