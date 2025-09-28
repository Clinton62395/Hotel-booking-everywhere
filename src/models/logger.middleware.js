const logger = async (req, res, next) => {
  const { method, url } = req;

  const date = new Date().toISOString();
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log("all prottoype about req==>", req);
    console.log(`${method} ${url} - ${date} [${duration}ms]`);
  });
  next();
};
export default logger;
