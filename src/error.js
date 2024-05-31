const SERVICE_CODE = 4;

const _getCode = ({ mc = 0, hc, code }) => {
  const responseCode = new Number(`${SERVICE_CODE}${mc}${hc}${code}`);
  return isNaN(responseCode) ? 500 : responseCode;
};

const _getStrError = (err) => {
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  if (err.slack) return err.slack;
  if (typeof err === "object") {
    return JSON.stringify(err);
  }
  console.log(err);
  return "";
};

const _getErrLogs = (err) => {
  if (typeof err === "string") return [];
  if (err && err.errLogs) return err.errLogs;
  return [];
};

const _getSuccess = (cc) => {
  if (!cc) return {};
  return { code: _getCode(cc), message: cc.message };
};

const _getError = (err) => {
  if (!err) return {};
  return {
    code: _getCode(err),
    message: _getStrError(err),
    errLogs: _getErrLogs(err),
    status: _getStatus(err),
  };
};

const _getStatus = (err) => {
  if (err.status) return err.status;
  return null;
};

const UN_SUCCESS = { success: false };

const HTTP_CODE = {
  _200: {
    httpCode: 200,
    type: "SUCCESS",
    code: 200,
    message: "ok",
    success: true,
  },
  _400: {
    httpCode: 400,
    type: "BAD_REQUEST",
    code: 400,
    message: "bad request",
    ...UN_SUCCESS,
  },
  _401: {
    httpCode: 401,
    type: "UNAUTHORIZED",
    code: 401,
    message: "unauthorized",
    ...UN_SUCCESS,
  },
  _404: {
    httpCode: 404,
    type: "NOT_FOUND",
    code: 404,
    message: "not found",
    ...UN_SUCCESS,
  },
  _500: {
    httpCode: 500,
    type: "INTERNAL_SERVER_ERROR",
    code: 500,
    message: "server error",
    ...UN_SUCCESS,
  },
};

const CUSTOM_CODE = {
  _200: (data, cc) => ({ ...HTTP_CODE._200, ..._getSuccess(cc), data }),

  _400: (e) => ({ ...HTTP_CODE._400, ..._getError(e) }),

  _401: (e) => ({ ...HTTP_CODE._401, ..._getError(e) }),

  _404: (e) => ({ ...HTTP_CODE._404, ..._getError(e) }),

  _500: (e) => ({ ...HTTP_CODE._500, ..._getError(e) }),
};

export { HTTP_CODE, CUSTOM_CODE };
