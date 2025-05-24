# Rate Limiter

A JavaScript implementation of a rate limiter that allows dynamic modification of request limits.

## Overview

This rate limiter helps control the number of requests made to your application. It's written in JavaScript and can be easily integrated into any Node.js application.

## Key Features

- Control request rates for different users
- Modify limits while the application is running
- Simple to use and integrate
- No external dependencies required

## Basic Usage

```javascript
const RateLimiter = require('./rateLimiter');

// Initialize with default settings
const rateLimiter = new RateLimiter({
    defaultLimit: 100,    // 100 requests
    defaultWindow: 60000  // per minute
});

// Check if a request is allowed
const isAllowed = rateLimiter.isAllowed('user-123');

// Update rate limit for a specific user
rateLimiter.setCustomLimit('user-123', 50, 30000);
```

## Requirements

- Node.js environment
- No additional dependencies

## Implementation Details

The rate limiter uses a sliding window approach to track requests and can be configured with different limits for different users. It's designed to be memory-efficient and easy to maintain. 