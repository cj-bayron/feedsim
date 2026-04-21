const https = require('https')

const AUTH_HOSTS = {
  TEST: 'accounts-test.bandlab.com',
  PROD: 'accounts.bandlab.com',
}

module.exports = async function (context, req) {
  const env = req.query.env || 'TEST'
  const host = AUTH_HOSTS[env] || AUTH_HOSTS.TEST
  const body = req.rawBody || ''

  try {
    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: host,
        path: '/oauth/connect/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Client-Id': 'BandLab-Backend',
          'Content-Length': Buffer.byteLength(body),
        },
      }

      const request = https.request(options, (response) => {
        let data = ''
        response.on('data', (chunk) => { data += chunk })
        response.on('end', () => resolve({ status: response.statusCode, body: data }))
      })

      request.on('error', reject)
      request.write(body)
      request.end()
    })

    context.res = {
      status: result.status,
      headers: { 'Content-Type': 'application/json' },
      body: result.body,
    }
  } catch (err) {
    context.res = {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'proxy_error', error_description: err.message }),
    }
  }
}
