const client = require('prom-client');

const apiRequestsTotal = new client.Counter({
  name: 'api_requests_total',
  help: 'Total number of HTTP requests handled by the API',
  labelNames: ['method', 'route', 'status_code'],
});

const apiRequestDurationSeconds = new client.Histogram({
  name: 'api_request_duration_seconds',
  help: 'Duration of HTTP requests handled by the API in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

function resolveRoute(req) {
  if (req.route?.path) {
    return `${req.baseUrl || ''}${req.route.path}`;
  }

  return 'unmatched';
}

function metricsMiddleware(req, res, next) {
  if (req.path === '/metrics') {
    return next();
  }

  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const route = resolveRoute(req);
    const statusCode = String(res.statusCode);
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    const labels = {
      method: req.method,
      route,
      status_code: statusCode,
    };

    apiRequestsTotal.inc(labels);
    apiRequestDurationSeconds.observe(labels, durationSeconds);
  });

  next();
}

async function metricsHandler(req, res) {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
}

module.exports = {
  metricsHandler,
  metricsMiddleware,
};
