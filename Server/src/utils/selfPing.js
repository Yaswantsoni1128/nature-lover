// Using built-in fetch (Node 18+) - no import needed

class SelfPing {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
        this.baseUrl = this.getBaseUrl();
    }

    getBaseUrl() {
        // Try to get URL from environment variable first
        if (process.env.RENDER_URL) {
            return process.env.RENDER_URL;
        }
        
        // Auto-detect from Render environment
        if (process.env.RENDER_EXTERNAL_URL) {
            return process.env.RENDER_EXTERNAL_URL;
        }
        
        // Fallback to localhost for development
        const port = process.env.PORT || 3000;
        return `http://localhost:${port}`;
    }

    async ping() {
        try {
            const response = await fetch(`${this.baseUrl}/ping`, {
                method: 'GET',
                timeout: 10000, // 10 second timeout
                headers: {
                    'User-Agent': 'SelfPing/1.0'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Self ping successful at ${data.time}`);
                return true;
            } else {
                console.log(`❌ Self ping failed: HTTP ${response.status}`);
                return false;
            }
        } catch (error) {
            console.log(`❌ Self ping failed: ${error.message}`);
            return false;
        }
    }

    start() {
        // Only start if not already running and not in test environment
        if (this.isRunning || process.env.NODE_ENV === 'test') {
            return;
        }

        console.log(`🚀 Starting self-ping service...`);
        console.log(`📍 Ping URL: ${this.baseUrl}/ping`);
        console.log(`⏰ Ping interval: 10 minutes`);

        this.isRunning = true;
        
        // Initial ping after 30 seconds (to let server fully start)
        setTimeout(() => {
            this.ping();
        }, 30000);

        // Then ping every 10 minutes
        this.intervalId = setInterval(() => {
            this.ping();
        }, 10 * 60 * 1000); // 10 minutes in milliseconds

        console.log(`✅ Self-ping service started successfully`);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        console.log(`🛑 Self-ping service stopped`);
    }

    // Graceful shutdown
    shutdown() {
        console.log(`🔄 Shutting down self-ping service...`);
        this.stop();
    }
}

// Create singleton instance
const selfPing = new SelfPing();

// Handle graceful shutdown
process.on('SIGTERM', () => {
    selfPing.shutdown();
    process.exit(0);
});

process.on('SIGINT', () => {
    selfPing.shutdown();
    process.exit(0);
});

export default selfPing;
