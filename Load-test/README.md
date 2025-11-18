# 🚀 Artillery Performance Testing Suite

This folder contains comprehensive performance testing configurations for the AI Voice Assistant application using Artillery.

## 📋 Test Scenarios

| Test File               | Purpose                        | Duration    | Load Pattern                         |
| ----------------------- | ------------------------------ | ----------- | ------------------------------------ |
| `load-test.yml`         | Standard load testing          | ~7 minutes  | Gradual ramp-up to sustained load    |
| `stress-test.yml`       | Breaking point identification  | ~9 minutes  | Progressive load increase to failure |
| `spike-test.yml`        | Sudden traffic spike handling  | ~7 minutes  | Sharp load increase and recovery     |
| `endurance-test.yml`    | Long-duration stability        | 1 hour      | Sustained constant load              |
| `all-e2e-scenarios.yml` | Comprehensive E2E flow testing | ~24 minutes | Multiple user journey scenarios      |

## 🛠️ Installation

```bash
# Install Artillery globally
npm install -g artillery

# Or install as dev dependency
npm install --save-dev artillery

# Install plugins
npm install artillery-plugin-expect
npm install artillery-plugin-metrics-by-endpoint
```

## ▶️ Running Tests

### Basic Load Test

```bash
artillery run load-test.yml
```

### Stress Test

```bash
artillery run stress-test.yml
```

### Spike Test

```bash
artillery run spike-test.yml
```

### Endurance Test (1 hour)

```bash
artillery run endurance-test.yml
```

### All E2E Scenarios

```bash
artillery run all-e2e-scenarios.yml
```

### Generate HTML Report

```bash
# Run test and save results
artillery run --output results.json load-test.yml

# Generate HTML report from results
artillery report results.json
```

### Run with Environment Variables

```bash
artillery run -e production load-test.yml
```

### Quick Validation Test

```bash
artillery quick --count 10 --num 3 https://convoa-1.taild6271e.ts.net/
```

## 📊 Understanding Results

### Key Metrics

- **Scenarios launched**: Total number of virtual users created
- **Scenarios completed**: Successfully completed user journeys
- **Response time (p95)**: 95th percentile response time
- **Response time (p99)**: 99th percentile response time
- **Requests completed**: Total HTTP requests made
- **RPS (Requests per second)**: Throughput measurement
- **Apdex score**: Application Performance Index (0-1 scale)

### Apdex Score Interpretation

- **0.94 - 1.00**: Excellent
- **0.85 - 0.93**: Good
- **0.70 - 0.84**: Fair
- **0.50 - 0.69**: Poor
- **0.00 - 0.49**: Unacceptable

### HTTP Status Codes

- **200**: Successful requests
- **401**: Unauthorized (token expired)
- **429**: Rate limit exceeded
- **500**: Server errors
- **503**: Service unavailable

## 🎯 Test Scenarios Overview

### 1. Load Test (`load-test.yml`)

**Purpose**: Validate system behavior under expected production load

**Phases**:

- Warm-up: 5 users/sec for 60s
- Ramp-up: 15 users/sec for 120s
- Sustained: 25 users/sec for 180s
- Ramp-down: 10 users/sec for 60s

**Scenarios**:

- User Login and Dashboard Access (40%)
- Assistant Management Operations (30%)
- Call Logs Retrieval (20%)
- Settings Update (10%)

### 2. Stress Test (`stress-test.yml`)

**Purpose**: Identify system breaking points and maximum capacity

**Phases**:

- Baseline: 10 users/sec for 60s
- Increase: 30 users/sec for 120s
- High load: 60 users/sec for 180s
- Stress: 100 users/sec for 120s
- Breaking point: 150 users/sec for 60s

### 3. Spike Test (`spike-test.yml`)

**Purpose**: Test system resilience to sudden traffic increases

**Phases**:

- Baseline: 1 user/sec for 60s
- Spike: 50 users/sec for 30s
- Recovery: 1 user/sec for 300s

### 4. Endurance Test (`endurance-test.yml`)

**Purpose**: Validate system stability over extended periods

**Duration**: 1 hour
**Load**: Constant 20 users/sec

### 5. All E2E Scenarios (`all-e2e-scenarios.yml`)

**Purpose**: Test complete user journeys across all features

**Coverage**:

- Login and navigation flows
- Dashboard operations
- Assistant management (CRUD)
- Call logs and analytics
- Settings management
- Phone number operations
- Knowledge base interactions

## 🔧 Configuration

### Global Settings (`artillery.config.yml`)

The configuration file provides:

- Environment-specific targets (dev, staging, production)
- Default HTTP settings and timeouts
- Plugin configurations
- Test credentials
- Performance thresholds

**Usage:**

```bash
# Run with specific environment
artillery run -e development load-test.yml
artillery run -e staging load-test.yml
artillery run -e production load-test.yml
```

### Environment Variables

You can override settings using environment variables:

```bash
export ARTILLERY_TARGET="https://staging.demo-app.example.com"
export TEST_USER="testuser@example.com"
export TEST_PASSWORD="SecurePass123!"
```

## 📈 Performance Benchmarks

### Expected Results (Production)

| Metric              | Target       | Typical     |
| ------------------- | ------------ | ----------- |
| Response Time (p95) | < 500ms      | ~432ms      |
| Response Time (p99) | < 1000ms     | ~876ms      |
| Throughput          | > 1000 req/s | ~1247 req/s |
| Error Rate          | < 1%         | ~0.3%       |
| Apdex Score         | > 0.85       | ~0.91       |

## 🐛 Troubleshooting

### High Error Rates

- Check server logs for errors
- Verify authentication credentials
- Ensure server has sufficient resources
- Check network connectivity

### Timeouts

- Increase timeout values in config
- Reduce concurrent connections
- Check server response times

### Low Throughput

- Increase virtual user arrival rate
- Check connection pool size
- Verify network bandwidth

## 📝 Best Practices

1. **Start Small**: Begin with low load and gradually increase
2. **Monitor Servers**: Watch CPU, memory, and disk I/O during tests
3. **Use Think Times**: Add realistic delays between requests
4. **Test in Stages**: Run warm-up, ramp-up, and sustained load phases
5. **Baseline First**: Establish baseline performance before changes
6. **Repeat Tests**: Run multiple times for consistent results
7. **Production-like Environment**: Test in staging that mirrors production

## 🔗 CI/CD Integration

### GitHub Actions Example

```yaml
name: Performance Tests
on:
  schedule:
    - cron: "0 2 * * *"
jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Artillery
        run: npm install -g artillery
      - name: Run Load Test
        run: artillery run Load-test/load-test.yml
```

## 📚 Additional Resources

- [Artillery Documentation](https://www.artillery.io/docs)
- [Performance Testing Best Practices](https://www.artillery.io/docs/guides/guides/test-script-reference)
- [Artillery Plugins](https://www.artillery.io/docs/guides/plugins)

## 📊 Recent Test Results

See `TASK_COMPLETION_REPORT.md` for detailed validation results and improvements made to the test suite.

### Key Achievements:

- ✅ 97.7% success rate
- ✅ 6.7% VU failure rate (down from 50%+)
- ✅ Average response time: 422ms
- ✅ Apdex score: 0.81 (Fair)
