import jwt from "jsonwebtoken";

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    let decode;
    if (token) {
      decode = jwt.verify(token, process.env.JSON_SECRET);
      req.userId = decode?.id;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default authenticate;
