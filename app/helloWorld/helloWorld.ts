import { APIGatewayProxyEvent } from "aws-lambda";

const PL = process.env.PATH_LIB;
const { baseHandler } = require(`${PL}/base-handler`);

const init = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    const hello = { message: event.body };
    return hello;
  } catch (error) {
    return error;
  }
};

export const hello = baseHandler(init, { isCheckToken: false });
