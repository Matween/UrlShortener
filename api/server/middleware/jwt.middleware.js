const { JwtService } = require('../services');

class JwtMiddleware {

  constructor() {}

  verify(req, res, next) {
    const bearer = req.header('Authorization') || '';
    const token = bearer.split(' ')[1];
    const valid = JwtService.verify(token);
    return valid ? next() : res.status(401).send({ error: 'Unauthorized' });
  }

}

module.exports = new JwtMiddleware();
