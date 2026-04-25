const axios = require('axios');  
const fs = require('fs');  
const path = require('path');  
const BASE_URL = 'http://localhost:5000/api';  
let token = '';  
async function runTests() {  
const timestamp = Date.now();  
const testUser = { name: "Test User", email: `test_${timestamp}@example.com`, password: "Password123", role: "student" };  
