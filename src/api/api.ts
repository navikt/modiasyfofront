import { hentLoginUrl, hentRedirectBaseUrl } from "./index";

import axios from "axios";

const texts = {
  accessDenied: "Du har ikke tilgang til å utføre denne handlingen.",
  generalError: "Det skjedde en uventet feil. Vennligst prøv igjen senere.",
  networkError:
    "Vi har problemer med å koble til nettet. Vennligst sjekk din internettforbindelse.",
  loginRequired: "Handlingen krever at du logger på.",
};

export enum ErrorType {
  ACCESS_DENIED = "ACCESS_DENIED",
  GENERAL_ERROR = "GENERAL_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  LOGIN_REQUIRED = "LOGIN_REQUIRED",
}

export class Success<ResponseData> {
  constructor(
    public readonly data: ResponseData,
    public readonly code: number
  ) {}
}

export class Failure {
  constructor(public readonly error: ApiError, public readonly code?: number) {}
}

export interface ApiError {
  type: ErrorType;
  message: string;
  defaultErrorMsg: string;
}

export type Result<ResponseData> = Success<ResponseData> | Failure;

function handleError(error): Failure {
  if (error.response) {
    switch (error.response.status) {
      case 401: {
        window.location.href = `${hentLoginUrl()}?redirect=${hentRedirectBaseUrl()}`;
        return new Failure(
          {
            type: ErrorType.LOGIN_REQUIRED,
            message: error.message,
            defaultErrorMsg: texts.loginRequired,
          },
          error.response.status
        );
      }
      case 403: {
        const message =
          error.response.data.begrunnelse || error.response.data.message;
        return new Failure(
          {
            type: ErrorType.ACCESS_DENIED,
            message: message,
            defaultErrorMsg: texts.accessDenied,
          },
          error.response.status
        );
      }
      default:
        return new Failure(
          {
            type: ErrorType.GENERAL_ERROR,
            message: error.message,
            defaultErrorMsg: texts.generalError,
          },
          error.response.status
        );
    }
  } else if (error.request) {
    return new Failure({
      type: ErrorType.NETWORK_ERROR,
      message: error.message,
      defaultErrorMsg: texts.networkError,
    });
  } else {
    return new Failure({
      type: ErrorType.GENERAL_ERROR,
      message: error.message,
      defaultErrorMsg: texts.generalError,
    });
  }
}

export const get = <ResponseData>(
  url: string,
  fnr?: string
): Promise<Result<ResponseData>> => {
  return axios
    .get(url, {
      headers: { "nav-consumer-id": "syfomodiaperson", "nav-personident": fnr },
    })
    .then((response) => {
      return new Success(response.data, response.status);
    })
    .catch(function (error) {
      return handleError(error);
    });
};

export const post = <ResponseData>(
  url: string,
  data: Record<string, any>,
  fnr?: string
): Promise<Result<ResponseData>> => {
  return axios
    .post(url, data, {
      headers: { "nav-consumer-id": "syfomodiaperson", "nav-personident": fnr },
    })
    .then((response) => {
      return new Success(response.data, response.status);
    })
    .catch(function (error) {
      return handleError(error);
    });
};
