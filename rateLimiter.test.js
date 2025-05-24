const RateLimiter = require('./rateLimiter');

// Test helper function to simulate time passing
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
    console.log('Starting Rate Limiter Tests...\n');

    // Test 1: Basic Rate Limiting
    console.log('Test 1: Basic Rate Limiting');
    const basicLimiter = new RateLimiter({
        defaultLimit: 3,
        defaultWindow: 1000 // 1 second
    });

    console.log('Making 4 requests within 1 second:');
    for (let i = 0; i < 4; i++) {
        const allowed = basicLimiter.isAllowed('test-key');
        console.log(`Request ${i + 1}: ${allowed ? 'Allowed' : 'Blocked'}`);
    }
    console.log('\n');

    // Test 2: Custom Limits
    console.log('Test 2: Custom Limits');
    const customLimiter = new RateLimiter();
    customLimiter.setCustomLimit('premium-user', 2, 1000);
    
    console.log('Making 3 requests for premium user:');
    for (let i = 0; i < 3; i++) {
        const allowed = customLimiter.isAllowed('premium-user');
        console.log(`Request ${i + 1}: ${allowed ? 'Allowed' : 'Blocked'}`);
    }
    console.log('\n');

    // Test 3: Window Reset
    console.log('Test 3: Window Reset');
    const windowLimiter = new RateLimiter({
        defaultLimit: 2,
        defaultWindow: 1000
    });

    console.log('Making 2 requests:');
    for (let i = 0; i < 2; i++) {
        const allowed = windowLimiter.isAllowed('reset-key');
        console.log(`Request ${i + 1}: ${allowed ? 'Allowed' : 'Blocked'}`);
    }

    console.log('Waiting for window to reset...');
    await sleep(1100);

    console.log('Making 2 more requests after reset:');
    for (let i = 0; i < 2; i++) {
        const allowed = windowLimiter.isAllowed('reset-key');
        console.log(`Request ${i + 1}: ${allowed ? 'Allowed' : 'Blocked'}`);
    }
    console.log('\n');

    // Test 4: Dynamic Rate Limit Changes
    console.log('Test 4: Dynamic Rate Limit Changes');
    const dynamicLimiter = new RateLimiter({
        defaultLimit: 2,
        defaultWindow: 1000
    });

    console.log('Initial limit: 2 requests per second');
    for (let i = 0; i < 3; i++) {
        const allowed = dynamicLimiter.isAllowed('dynamic-key');
        console.log(`Request ${i + 1}: ${allowed ? 'Allowed' : 'Blocked'}`);
    }

    console.log('\nChanging limit to 4 requests per second...');
    dynamicLimiter.setCustomLimit('dynamic-key', 4, 1000);

    console.log('Making 4 requests with new limit:');
    for (let i = 0; i < 4; i++) {
        const allowed = dynamicLimiter.isAllowed('dynamic-key');
        console.log(`Request ${i + 1}: ${allowed ? 'Allowed' : 'Blocked'}`);
    }
    console.log('\n');

    // Test 5: Rate Limit Information
    console.log('Test 5: Rate Limit Information');
    const infoLimiter = new RateLimiter({
        defaultLimit: 5,
        defaultWindow: 1000
    });

    console.log('Making 2 requests and checking info:');
    for (let i = 0; i < 2; i++) {
        infoLimiter.isAllowed('info-key');
    }

    const info = infoLimiter.getRateLimitInfo('info-key');
    console.log('Rate Limit Info:', info);
}

// Run all tests
runTests().catch(console.error); 