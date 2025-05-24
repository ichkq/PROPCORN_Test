class RateLimiter {
    constructor(options = {}) {
        this.requests = new Map(); // Store request counts for each key
        this.windows = new Map();  // Store time windows for each key
        this.defaultLimit = options.defaultLimit || 100; // Default requests per window
        this.defaultWindow = options.defaultWindow || 60000; // Default window in milliseconds (1 minute)
        this.customLimits = new Map(); // Store custom limits for specific keys
    }

    // Set a custom rate limit for a specific key
    setCustomLimit(key, limit, window = this.defaultWindow) {
        this.customLimits.set(key, { limit, window });
    }

    // Remove custom rate limit for a key
    removeCustomLimit(key) {
        this.customLimits.delete(key);
    }

    // Check if a request is allowed
    isAllowed(key) {
        const now = Date.now();
        const limitConfig = this.customLimits.get(key) || {
            limit: this.defaultLimit,
            window: this.defaultWindow
        };

        // Initialize or get existing request data
        if (!this.requests.has(key)) {
            this.requests.set(key, 0);
            this.windows.set(key, now);
        }

        const requestCount = this.requests.get(key);
        const windowStart = this.windows.get(key);

        // Check if we're in a new window
        if (now - windowStart >= limitConfig.window) {
            this.requests.set(key, 1);
            this.windows.set(key, now);
            return true;
        }

        // Check if we've exceeded the limit
        if (requestCount >= limitConfig.limit) {
            return false;
        }

        // Increment request count
        this.requests.set(key, requestCount + 1);
        return true;
    }

    // Get current rate limit information for a key
    getRateLimitInfo(key) {
        const limitConfig = this.customLimits.get(key) || {
            limit: this.defaultLimit,
            window: this.defaultWindow
        };

        const requestCount = this.requests.get(key) || 0;
        const windowStart = this.windows.get(key) || Date.now();
        const remainingTime = Math.max(0, windowStart + limitConfig.window - Date.now());

        return {
            limit: limitConfig.limit,
            remaining: Math.max(0, limitConfig.limit - requestCount),
            reset: windowStart + limitConfig.window,
            remainingTime
        };
    }

    reset(key) {
        this.requests.delete(key);
        this.windows.delete(key);
        this.customLimits.delete(key);
    }

    getAllLimits() {
        return Array.from(this.customLimits.entries()).map(([key, config]) => ({
            key,
            limit: config.limit,
            window: config.window
        }));
    }
}

module.exports = RateLimiter;

// Example usage:
const rateLimiter = new RateLimiter({
    defaultLimit: 100,
    defaultWindow: 60000 // 1 minute
});

// Example: Set custom limit for a specific API key
rateLimiter.setCustomLimit('api-key-1', 50, 30000); // 50 requests per 30 seconds

// Example: Check if a request is allowed
const isAllowed = rateLimiter.isAllowed('api-key-1');
console.log('Request allowed:', isAllowed);

// Example: Get rate limit information
const rateInfo = rateLimiter.getRateLimitInfo('api-key-1');
console.log('Rate limit info:', rateInfo);

// Example: Modify rate limit on the fly
rateLimiter.setCustomLimit('api-key-1', 200, 60000); // Change to 200 requests per minute 