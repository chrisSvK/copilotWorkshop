class MetricsService {
  constructor() {
    this.metrics = {};
    this.startTime = Date.now();
    this.requestCounts = {
      total: 0,
      byEndpoint: {},
      byMethod: {},
      byStatusCode: {}
    };
    this.responseTimes = [];
  }

  trackRequest(req, res, startTime) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    this.requestCounts.total++;
    
    const endpoint = `${req.method} ${req.path}`;
    this.requestCounts.byEndpoint[endpoint] = (this.requestCounts.byEndpoint[endpoint] || 0) + 1;
    
    this.requestCounts.byMethod[req.method] = (this.requestCounts.byMethod[req.method] || 0) + 1;
    
    const statusCode = res.statusCode;
    this.requestCounts.byStatusCode[statusCode] = (this.requestCounts.byStatusCode[statusCode] || 0) + 1;
    
    this.responseTimes.push(responseTime);
    
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }
  }

  getMetrics() {
    const uptime = Date.now() - this.startTime;
    
    let totalResponseTime = 0;
    let minResponseTime = this.responseTimes[0] || 0;
    let maxResponseTime = this.responseTimes[0] || 0;
    
    for (const time of this.responseTimes) {
      totalResponseTime += time;
      if (time < minResponseTime) minResponseTime = time;
      if (time > maxResponseTime) maxResponseTime = time;
    }
    
    const avgResponseTime = this.responseTimes.length 
      ? totalResponseTime / this.responseTimes.length 
      : 0;
    
    return {
      uptime,
      requestCounts: this.requestCounts,
      responseTimes: {
        min: minResponseTime,
        max: maxResponseTime,
        avg: avgResponseTime,
        p95: this.calculatePercentile(95)
      }
    };
  }

  calculatePercentile(percentile) {
    if (this.responseTimes.length === 0) return 0;
    
    const sorted = [...this.responseTimes].sort((a, b) => a - b);
    const index = Math.ceil(percentile / 100 * sorted.length) - 1;
    return sorted[index];
  }

  resetMetrics() {
    this.metrics = {};
    this.startTime = Date.now();
    this.requestCounts = {
      total: 0,
      byEndpoint: {},
      byMethod: {},
      byStatusCode: {}
    };
    this.responseTimes = [];
  }
}

module.exports = new MetricsService();
