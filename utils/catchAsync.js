module.exports = (fn) => (req, res, next) => {
  //  in js we can write ((err) => next(err)); to  (next); and it will call next with parameter that were received
  fn(req, res, next).catch(next);
};
