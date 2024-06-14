/**

 * 
 * The following are some common HTTP status codes and their meanings:
 * 
 */
export default class ResponseError extends Error {
    /**
     * ResponseError class extends the built-in Error class in JavaScript.
     * This class is used to throw custom errors with specific HTTP status codes.
     * @param {number} status - The HTTP status code or status text of the error.
     *                        - 200: OK - The request has succeeded.
     *                        - 400: Bad Request - The server could not understand the request due to invalid syntax.
     *                        - 401: Unauthorized - The client must authenticate itself to get the requested response.
     *                        - 403: Forbidden - The client does not have access rights to the content.
     *                        - 404: Not Found - The server can not find the requested resource.
     *                        - 500: Internal Server Error - The server has encountered a situation it doesn't know how to handle.
     * @param {string} message - The error message.
     */
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}