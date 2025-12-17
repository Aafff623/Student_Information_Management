/**
 * 响应对象，包含了axios外层元素，接口具体返回的在data中，由拦截器处理
 */
import {createResponseProxy, doPromise} from "./proxy";
class Response {
	status = -1;
	headers = {};
	data = {};
	message = {};
	meta = {auth: true, validate: true};
	queue = [];
	request = null;
	constructor(promise, config) {
		doPromise(promise, (state, response) => {
			this.setRequest(response.request);
			this.setStatus(response.status);
			this.setData(response.data);
			this.setMessage(response.message);
			this.setHeaders(response.headers);
			if(response.request.responseType == 'blob') {
				this.setData(response);
			} else {
				this.setData(config.interceptorResponse(this));
			}

			this.queue.forEach(q => {
				this[q.method](...q.arg0)
			});
		})
		return createResponseProxy(this, promise);
	}

	setData(data) {
		this.data = data;
	}

	getData() {
		return this.data;
	}

	setHeaders(headers) {
		this.headers = headers;
	}

	getHeaders() {
		return this.headers;
	}

	setStatus(status) {
		this.status = status;
	}

	getStatus() {
		return this.status;
	}

	setMessage(message) {
		this.message = message;
	}

	getMessage() {
		return this.message;
	}

	getMeta() {
		return this.meta;
	}

	setRequest(request) {
		this.request = request;
	}

	getRequest() {
		return this.request;
	}
}

export default Response;
