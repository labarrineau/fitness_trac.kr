//UTILS FUNCTIONS

const requireUser = (req, res, next) => {
    if (!req.user) {
        res.status(401);
        next({
          name: 'MissingUserError',
          message: 'You must be logged in to perform this action',
        });
    } else {
        next();
    }
};



const requiredNotSent =
  ({ requiredParams, atLeastOne }) =>
  (req, res, next) => {
    if (atLeastOne) {
      // Only one of the parameters is required
      let numParamsFound = 0;
      for (const param of requiredParams) {
        if (req.body[param] !== undefined) {
          numParamsFound++;
        }
      }

      if (numParamsFound === 0) {
        next({
          name: 'MissingParams',
          message: `Must provide at least one of these in body: ${requiredParams.join(
            ', ',
          )}`,
        });
      } else {
        next();
      }
    } else {

      const notSent = [];

      for (const param of requireParams) {
        if (req.body[param] === undefined) {
          notSent.push(param);
        }
      }

      if (notSent.length) {
        next({
          name: 'MissingParams',
          message: `Required parameters not sent in body: ${notSent.join(
            ', ',
          )}`,
        });
      } else {
        next();
      }
    }
  };


module.exports = {
  requireUser,
  requiredNotSent,
};


  