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
	"name": "Create users",
	"author": "Gaston Fernandez",
	"httpRequest" : {
    	"method" : "DELETE",
    	"path" : "/api/v1/users/1",
    	"headers": {
			"Content-type": "application/json",
			"Connection": "keep-alive"
		}
	},
	"httpResponse" : {
		"body":{
			"errors": [{
				"message": "USER DOES NOT EXIST",
				"code": "USER001"
			}]
		},
		"headers": 
    		{
    			"Content-type": "application/json",
    			"Connection": "keep-alive"
    		},
		"statusCode": 400
    }
}
````