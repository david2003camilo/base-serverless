// File with the logic to generate and validate jwt token.

// When working locally, the path of the libraries automatically points to the root node modules,
// when it is in a lambda layer, it accesses the local node modules directory of the base-bulltor directory
import moment from 'moment';
import jwt from 'jwt-simple';
import { sha512 } from 'js-sha512';
import uniqid from 'uniqid';

const PL = process.env.PATH_LIB;
// const { connectToDB } = require(`${PL}/db-connection`);

const BEARER = 'Bearer ';
const NO_TOKEN_SUPPLIED = {
  statusCode: 403,
  message: 'No token supplied',
};

export const shaEncrypt = (msg: string) => {
  const hash = sha512.create();
  hash.update(msg);
  return hash.hex();
};

export const generateSalt = () => {
  return uniqid();
};

export const createToken = (
  userId: number,
  role: string,
  subdomain: string
) => {
  const payLoad = {
    sub: userId,
    iat: moment().unix(),
    exp: moment()
      .add(
        subdomain && subdomain.includes('mobile') ? 30 : 15,
        'days'
      )
      .unix(),
    role,
    subdomain,
  };

  const token = jwt.encode(payLoad, process.env.JWT_PASS);
  return token;
};

export const decodePayload = (payLoad: any) =>
  jwt.decode(payLoad, process.env.JWT_PASS);

export const checkToken = async (authHeader: string) => {
  try {
    if (authHeader.startsWith(BEARER)) {
      const token = authHeader.substring(7, authHeader.length);
      const payLoad = jwt.decode(token, process.env.JWT_PASS);
      return payLoad;
    } else {
      throw NO_TOKEN_SUPPLIED;
    }
  } catch (e) {
    console.log('Error JWT ', e);
    if (e.message == 'Token expired') {
      throw {
        statusCode: 401,
        message:
          'Las credenciales de acceso han expirado, vuelve e inicia sesión',
      };
    } else {
      throw {
        statusCode: 400,
        message: e.toString(),
      };
    }
  }
};
