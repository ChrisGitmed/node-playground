const uuid = require('uuid');

class Err extends Error {
  constructor({ message, code = 500, context = '' }) {
    super(message);

    Object.assign(this, { err_message: message, code, uuid: uuid.v4() });

    Error.captureStackTrace(this, Err);
  };
};

const errHandler = (err, next, context = 'No context provided') => {
  if (err instanceof Err) next(err);
  return next(new Err({ message: err, code: 500, context }));
};

module.exports = { Err, errHandler };
