const router = require('../../router/router');


/// Getting User Agent & IP Address from Request
router.get('/user-agent', async (req, res, next) => {

  res.status(200).json({
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
  });
});

