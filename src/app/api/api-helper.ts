import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || "Tgi_ismy-jwt-private-key";

type tokenDetails = {
  name: string;
  email: string;
};

export const createToken = async (details: tokenDetails) => {
  const token = await jwt.sign(
    details,
    JWT_PRIVATE_KEY,
    { algorithm: "RS256",expiresIn: "1h" }
  );
  return token;
};

export const verifyToken =async (token:string):Promise <string>=> {
        const decoded = jwt.verify(token, JWT_PRIVATE_KEY as string);
        return decoded as string;
};

export const encrypt = async (password: string):Promise<string> => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPass = bcrypt.hashSync(password, salt);
  return hashedPass;
};

export const decrypt = async (password: string, hashedPassword: string):Promise<boolean> => {
  const isMatch = bcrypt.compareSync(password, hashedPassword);
  return isMatch;
};