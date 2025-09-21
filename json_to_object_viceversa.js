const jsonString = '{"name": "John", "age": 30, "city": "New York"}';

// Convert JSON string to JavaScript object
const jsonObject = JSON.parse(jsonString);
console.log('JavaScript Object:', jsonObject);



const ojectToConvert = {
    name: "Alice",
    age: 25,
    city: "Los Angeles"
}
// Convert JavaScript object back to JSON string
const newJsonString = JSON.stringify(ojectToConvert);
console.log('JSON String:', newJsonString);

console.log(typeof jsonObject); // object
console.log(typeof newJsonString); // string