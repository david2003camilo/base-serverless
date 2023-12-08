import { APIGatewayProxyEvent } from "aws-lambda";
import { Op } from "sequelize";
import moment from "moment";
import AWS from "aws-sdk";
const request = require("request");
const axios = require("axios");

export const queryOr = (orArray: Array<any>) => {
  let query: any = {};
  const queryOrObject: any = orArray.map((orItem) => {
    return {
      [orItem.name]: {
        [Op.iLike]: `%${orItem.value}%`,
      },
    };
  });

  if (queryOrObject.length) {
    query = {
      [Op.or]: queryOrObject,
    };
  }

  return query;
};

export const findAllIN = async (
  entity: any,
  attributes: Array<any>,
  paramsIN: Array<any>
) => {
  return await entity.findAll({
    attributes,
    where: {
      id: {
        [Op.in]: paramsIN,
      },
    },
  });
};

export const greaterThan = (name: string, value: number) => {
  return {
    [name]: {
      [Op.gt]: value,
    },
  };
};

export const getTodayPlusMonths = (months: number) => {
  return moment().add("months", months).toDate();
};

export const sendMessageSQS = async (
  endpoint: string,
  queueUrl: string,
  body: any
) => {
  const configParams =
    endpoint != undefined || endpoint != null || endpoint != ""
      ? { apiVersion: "2012-11-05", endpoint }
      : { apiVersion: "2012-11-05" };

  if (queueUrl == undefined) {
    throw {
      statusCode: 400,
      message: "La url de la cola sqs no debe ser vacía",
    };
  }

  const sqs = new AWS.SQS(configParams);
  const params = {
    MessageBody: JSON.stringify(body),
    QueueUrl: queueUrl.replace("http://localhost:4566", endpoint),
  };

  return await sqs.sendMessage(params).promise();
};

export const requiredFields = (bodyParams: any, fields: Array<String>) => {
  const params = Object.keys(bodyParams);
  fields.forEach((field) => {
    const index = params.indexOf(`${field}`);
    if (index < 0) {
      throw {
        statusCode: 400,
        message: `El campo ${field} es obligatorio`,
      };
    }
  });
};

export const convertNumberField = (value: any) => {
  if (isNaN(parseInt(value))) {
    throw {
      statusCode: 400,
      message: "El id debe ser un número natural",
    };
  }
  return parseInt(value);
};

export const invokeLambda = async (
  event: APIGatewayProxyEvent,
  functionName: string,
  body: any,
  pathParameters: any
) => {
  AWS.config.region = "us-east-1";
  const lambda = new AWS.Lambda({
    endpoint: "http://192.168.10.178:4566",
  });

  //PENDIENTE  THROW

  var params = {
    FunctionName: functionName, // the lambda function we are going to invoke
    InvocationType: "RequestResponse",
    LogType: "Tail",
    Payload: JSON.stringify({
      body: body,
      headers: event.headers,
      pathParameters: pathParameters ?? {},
    }),
  } as AWS.Lambda.InvocationRequest;

  const result = (await lambda.invoke(params).promise()) as any;
  return JSON.parse(JSON.parse(result.$response.data["Payload"]).body);
};

export const httpRequest = async (options: any) =>
  new Promise((resolve, reject) => {
    request(options, function (error: any, response: any) {
      if (error) reject(error);
      resolve(response.body);
    });
  });

export const momentUnix = () => moment().unix();

export const findHashtags = (searchText: any) => {
  const regexp = /(\s|^)\#\w\w+\b/gm;
  let result = searchText.match(regexp);
  if (result) {
    result = result.map(function (s: any) {
      return s.trim();
    });
    return result;
  } else {
    return false;
  }
};

export const findUrls = (searchText: any) => {
  const regexp =
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[A-Z0-9+&@#/%=~_|$])/gim;
  let result = searchText.match(regexp);
  if (result) {
    result = result.map(function (s: any) {
      return s.trim();
    });
    return result;
  } else {
    return false;
  }
};

export const getNameFiles = (report: any, company: any) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${report}_${company}_${year}${month}${day}`;
};

export const httpRequestAxios = async (url: string) => {
  const resp = await axios.get(url);
  return resp.data;
};

export const validDate = (dateVideo: string): string => {
  let dateSplit: string[] = splitString(dateVideo, "T");

  let validHour: string[] = splitString(dateSplit[1], ":");
  let validDays: string[] = splitString(dateSplit[0], "-");

  validHour = validNumber(validHour);
  validDays = validNumber(validDays);

  return `${validDays[0]}-${validDays[1]}-${validDays[2]}T${validHour[0]}:${validHour[1]}:${validHour[2]}Z`;
};

export const splitString = (text: string, splitCharacter: string) => {
  text = text.replace("Z", "");
  return text.split(splitCharacter);
};

export const validNumber = (time: string[]) => {
  const numbers = time.map((element) => {
    if (Number(element) <= 9 && element.length == 1) {
      return `0${element}`;
    } else {
      return element;
    }
  });
  return numbers;
};

export const momentInstance = (date: string) => {
  let dateVideo = moment(date, moment.ISO_8601);
  return dateVideo.unix()
};
