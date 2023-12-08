import { checkToken } from './jwt';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { closeConnectionDatabase } from './db-connection';

export const baseHandler = (init: any, params: any) => {
  return middy(init)
    .use(
      middleBaseHandler(
        params == undefined || params['isCheckToken'] == undefined
          ? true
          : params['isCheckToken'],
        params == undefined || params['manualResponse'] == undefined
          ? false
          : params['manualResponse']
      )
    )
    .use(cors());
};

const middleBaseHandler = (
  isCheckToken: true,
  manualResponse: false
) => {
  const baseConstrollerBefore = async (request: any) => {
    try {
      const isBodyString = typeof request.event.body == 'string';
      if (isBodyString && request.event.body != '') {
        request.event.body = JSON.parse(request.event.body);
      }
    } catch (e) {
      throw {
        statusCode: 400,
        message: 'Error parseando el cuerpo de la solictud',
      };
    }
    try {
      if (isCheckToken) {
        const payLoad = await checkToken(
          request.event.headers.authorization
            ? request.event.headers.authorization
            : request.event.headers.Authorization
        );
        request.event.user = payLoad;
      }
    } catch (e) {
      throw e;
    }
  };

  const baseConstrollerAfter = async (request: any) => {
    await closeConnectionDatabase();

    if (manualResponse == false) {
      request.response = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, DELETE',
        },
        body: JSON.stringify(
          {
            data:
              request.response.body != null
                ? request.response.body
                : request.response,
          },
          null,
          2
        ),
      };
    }
  };

  const baseConstrollerOnError = async (request: any) => {
    await closeConnectionDatabase();

    request.response = {
      statusCode: request.error.statusCode
        ? request.error.statusCode
        : 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, DELETE',
      },
      body: JSON.stringify({
        data: request.error.statusCode
          ? request.error.message
          : 'Ha ocurrido un error desconocido. Intente nuevamente o comuniquese con el administrador de plataforma',
      }),
    };
    request.error = null;
  };

  return {
    before: baseConstrollerBefore,
    after: baseConstrollerAfter,
    onError: baseConstrollerOnError,
  };
};
