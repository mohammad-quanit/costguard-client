// Simple test script to verify API integration
console.log('Testing API integration...');

// Test the proxy endpoint
fetch('http://localhost:8080/api/cost-usage')
  .then(response => {
    console.log('Response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('API Response received successfully!');
    console.log('Total Cost:', data.totalCost);
    console.log('Monthly Budget:', data.budget.monthlyBudget);
    console.log('Budget Status:', data.budget.budgetStatus);
    console.log('Service Count:', data.serviceCount);
  })
  .catch(error => {
    console.error('API Test failed:', error);
  });
