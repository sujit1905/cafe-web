/**
 * Send a standardized success JSON response
 * @param {import('express').Response} res
 * @param {*} data - Payload data
 * @param {string} [message='Success'] - Descriptive message
 * @param {number} [statusCode=200] - HTTP status code
 */
export const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send a standardized error JSON response
 * @param {import('express').Response} res
 * @param {string} [message='Error occurred'] - Descriptive error message
 * @param {number} [statusCode=400] - HTTP status code
 * @param {Array|Object|null} [errors=null] - Detailed validation or field errors
 */
export const errorResponse = (res, message = 'Error occurred', statusCode = 400, errors = null) => {
  const payload = {
    success: false,
    message,
  };

  if (errors !== null && errors !== undefined) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};

export default {
  successResponse,
  errorResponse,
};
