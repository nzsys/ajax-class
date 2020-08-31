const READYSTATE_COMPLETED = 4
const HTTP_STATUS_OK = 200

class Ajax {
	constructor(options, done = {}, fail = {}, always = {}) {
		this.url = options.url
		this.method = options.method.toUpperCase()
		this.data = options.data
		this.request(done, fail, always)
	}

	request(done = {}, fail = {}, always = {}) {
		let request = new XMLHttpRequest()
		request.open(this.method, this.url)
		request.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
		request.send(this.encode(this.data))
		request.onreadystatechange = () => {
			try {
				if (request.readyState === READYSTATE_COMPLETED) {
					if (request.status === HTTP_STATUS_OK) {
						let response
						switch (request.responseType) {
							case 'text':
								response = request.responseText
							case 'xml':
								response = request.responseXML
							case 'json':
								response = JSON.parse(request.responseText)
							default:
								response = request.response
						}
						let params = {
							status: request.status,
							response: {
								string: response,
								ready_state: request.readyState,
								type: request.responseType,
								headers: request.getAllResponseHeaders()
							}
						}
						if (done) {
							return done(params.response.string);
						}
					} else {
						if (fail) {
							return fail(request);
						}
					}
				}
				if (always) {
					return always(request);
				}
			} catch (e) {
				console.error(e)
			}
		}
	}

	encode(data) {
		var param = []
		for (var key in data) {
			param.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
		}
		return param.join('&').replace(/%20/g, '+')
	}
}
