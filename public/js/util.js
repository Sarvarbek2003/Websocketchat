let backendApi = 'http://localhost:3000'

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
    
    if(response){
        return await response.json();
    }
    return response
}

function createElements(...array) {
    return array.map(el => document.createElement(el))
}