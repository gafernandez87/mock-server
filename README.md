# MOCK SERVER

Create a mock
````
POST /mocks
    {
        "name": "Identity service mock",
        "brand": "AR",
        "product": "Welp",
        "author": "Gaston Fernandez",
        "description": "Mock de la respuesta del servicio de Identity Service"
    }
````

Retorna mockId


Create and endpoint
````
POST /mocks/:mock_id/endpoints
{
	"name": "Get user 1",
	"author": "Gaston Fernandez",
	"httpRequest" : {
    	"method" : "GET",
    	"path" : "/api/v1/users/1"
	},
	"httpResponse" : {
		"body":{
			"name": "Gaston",
			"last_name": "Fernandez"
		},
		"statusCode": 200
    }
}
````