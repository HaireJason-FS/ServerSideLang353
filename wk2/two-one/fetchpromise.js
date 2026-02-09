// Promises

const myPromise = new Promise((resolve,reject) => {
  // Asynchronous operation
  setTimeout(() => {
    const success = true; // Simulate successful operation
    if (success) {
      resolve("Operation successful!");
    } else {
      reject(new Error("Operation failed."));
    }
  }, 2000); // Simulate a delay of 2 seconds
});

myPromise
  .then((message) => {
    console.log('Success:', message);
  })
  .catch((error) => {
    console.log('Error:', error.message);
  });


// Fetch API with Promises

fetch(url)
  // Inital fetch request, returns a promise that resolves to the response object
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse JSON data
  })
  // Handles the response
  .then(data => {
    console.log('Data received:', data);
  })
  // handles any errors and catches them
  .catch(error => {
    console.error('Fetch error:', error);
  });