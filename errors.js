exports.handleCustomsError = (err, req, res, next) => {
  if (err.status) {
    const { status, msg } = err;
    res.status(status).send(msg);
  } else {
    next(err);
  }
};
