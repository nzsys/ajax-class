class Ajax {
	constructor(options, done = {}, fail = {}, always = {}) {	
		this.url                  = options.url
		this.method               = options.method.toUpperCase()
		this.data                 = options.data
		this.READYSTATE_COMPLETED = 4
		this.HTTP_STATUS_OK       = 200
		this.request(done, fail, always)
	}

	request(done, fail, always) {
		let request = new XMLHttpRequest()
		request.open(this.method, this.url)
		request.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
		request.send(this.encode(this.data))
		let params = {}

		const promise = new Promise((resolve, reject) => {
			request.onreadystatechange = () => {
				try {
					if (request.readyState === this.READYSTATE_COMPLETED) {
						if (request.status === this.HTTP_STATUS_OK) {
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
							params = {
								status: request.status,
								response: {
									string: response,
									ready_state: request.readyState,
									type: request.responseType,
									headers: request.getAllResponseHeaders()
								}
							}
							resolve(params.response.string)
						} else {
							reject(request)
						}
					}
				} catch (e) {
					reject(e)
				}	
			}
		})
		promise.then( (string) => {
			if (done) {
				return done(string)
			}
		}).catch( (e) => {
			if (fail) {
				return fail(e)
			}
		}).then( (string) => {
			if (always) {
				return always(string)
			}
		})
		
	}

	encode(data) {
		var param = []
		for (var key in data) {
			param.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
		}
		return param.join('&').replace(/%20/g, '+')
	}
}
