import { CUSTOM_CODE } from "./error.js";
//import * as Sentry from "@sentry/node"; // Ensure you have Sentry imported

const _spanFinished = (span, response, err) => {
  if (!span) return;

  if (err) {
    const stack = err.stack ? err.stack : null;
  } else {
  }

  span.finish();
};

const to = (promise) => {
  return promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => [err]);
};

const TE = (err, isLog = false) => {
  if (isLog) {
    console.error(err);
  }

  throw err;
};

const SUCCESS = (res, codeObj, data, span = null) => {
  const { hc, code, message } = codeObj;

  _spanFinished(span);

  let response = CUSTOM_CODE._200(data);

  if (hc && code && message) {
    response = CUSTOM_CODE[`_${hc}`](data, codeObj);
  }

  res.status(response.httpCode).json(response);

  return response;
};

const ERROR = (res, err, span = null, traceId = "") => {
  try {
    const error = err.error ? err.error : err;

    let response = CUSTOM_CODE._500(error);

    if (error && error.hc && error.message) {
      response = CUSTOM_CODE[`_${error.hc}`](error);
    }

    _spanFinished(span, response, error);

    return res.status(response.httpCode).json({
      ...response,
      traceId,
    });
  } catch (catchErr) {
    console.log("****", catchErr);

    Sentry.captureException(err);

    const response = CUSTOM_CODE._400(err);

    _spanFinished(span, response, catchErr);

    return res.status(response.httpCode).json({
      ...response,
      traceId,
    });
  }
};

const VALIDATION_ERROR = (res, err, span = null, traceId = "") => {
  try {
    const error = err.error ? err.error : err;

    let response = CUSTOM_CODE._400(error);

    if (error && error.hc && error.message) {
      response = CUSTOM_CODE[`_${error.hc}`](error);
    }

    _spanFinished(span, response, error);

    return res.status(response.httpCode).json({
      ...response,
      traceId,
    });
  } catch (catchErr) {
    console.log("****", catchErr);

    Sentry.captureException(err);

    const response = CUSTOM_CODE._400(err);

    _spanFinished(span, response, catchErr);

    return res.status(response.httpCode).json({
      ...response,
      traceId,
    });
  }
};

const UNAUTHORIZED_ERROR = (res, err, span = null, traceId = "") => {
  try {
    const error = err.error ? err.error : err;

    let response = CUSTOM_CODE._401(error);

    if (error && error.hc && error.message) {
      response = CUSTOM_CODE[`_${error.hc}`](error);
    }

    _spanFinished(span, response, error);

    return res.status(response.httpCode).json({
      ...response,
      traceId,
    });
  } catch (catchErr) {
    console.log("****", catchErr);

    Sentry.captureException(err);

    const response = CUSTOM_CODE._400(err);

    _spanFinished(span, response, catchErr);

    return res.status(response.httpCode).json({
      ...response,
      traceId,
    });
  }
};

const mapError = (err, message) => {
  const error = {
    message: message,
    stack: err.stack,
    errorInfo: err.errorInfo,
  };

  if (typeof err === "string") {
    error.error = err;
    return error;
  }

  if (err.message) {
    error.error = err.message;
    return error;
  }

  if (err.message && err.code) {
    error.error = err.message;
    error.code = err.code;
    return error;
  }

  if (err.error) {
    error.error = err.error;
    return error;
  }

  if (typeof err === "object") {
    error.error = JSON.stringify(err);
    return error;
  }

  console.error(err);

  error.error =
    "unknown error, please check initiation-workflow consol log manual";
  return error;
};

const parseToObject = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};




export { to, 
  TE, 
  SUCCESS, 
  ERROR, 
  VALIDATION_ERROR, 
  UNAUTHORIZED_ERROR, 
  mapError, 
  parseToObject  };
