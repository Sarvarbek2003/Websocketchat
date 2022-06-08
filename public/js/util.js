let backendApi = 'http://xostlive.uz:7777'

async function req (path, method, body) {

    let headers = {
            "Authorization": 'Bearer '+ window.localStorage.getItem('token')
        }

    if( !(body instanceof FormData) ) {
		headers['Content-Type'] = 'application/json'
	}

    let response = await fetch(backendApi+path,{
        method,
        headers,
        body: (body instanceof FormData) ? body : JSON.stringify(body)
    })
    
    if(response.status == 201){
        return await response.json();
    } else if(response.status == 401) window.location = '/auth/login'
    return response
}

function createElements(...array) {
    return array.map(el => document.createElement(el))
}
