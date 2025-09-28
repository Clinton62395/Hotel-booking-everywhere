const asynchHandler = (fn) => (req, res, next) => {
  Promise.resolve(async(req, res, next)).catch(next);
};
export default asynchHandler;
