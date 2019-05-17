# MOCK SERVER

The idea behind this mock-server is to create APIs that responds whaterver you want.

MockServer can be used for mocking any system you integrate with via HTTP (i.e. services, web sites, etc).ç
When MockServer receives a request, it matches the requested path against an active endpoint that have been configured.
An endpoint defines the action that is taken, for example, a response could be returned with an specific status code.

MockServer supports the follow actions:


### List all mocks

````
GET /mock-server/mocks

Response
[
  {
    "_id": "5cdf127e7189542dd2d17b8d",
    "name": "New mock",
    "country": "AR",
    "product": "MANGO",
    "author": "Gaston Fernandez",
    "description": "Testing mock",
    "prefix": "/success",
    "creation_date": "2019-05-17T19:58:54.182Z",
    "last_update": "2019-05-17T19:58:54.182Z"
  }
]
````

### Get a mock

````
GET /mock-server/mocks/:mock_id

Response
{
	"_id": "5cdf127e7189542dd2d17b8d",
	"name": "New mock",
	"country": "AR",
	"product": "MANGO",
	"author": "Gaston Fernandez",
	"description": "Testing mock",
	"prefix": "/success",
	"creation_date": "2019-05-17T19:58:54.182Z",
	"last_update": "2019-05-17T19:58:54.182Z"
}
````

### Create Mock

````
POST /mock-server/mocks
    {
        "name": "Flow Argentina WELP",
        "description": "Mock de todos los endpoints del flowhelper",
        "country": "AR",
        "product": "WELP",
        "author": "Gaston Fernandez",
		"prefix": "/test_case_1"
    }
````

Response
````
	{
		_id: "5cdf127e7189542dd2d17b8d"
	}
````

### Update Mock

````
PUT /mock-server/mocks/:mock_id
    {
        "name": "Flow Argentina WELP"
    }
````

### Create Endpoint

````
POST /mocks-server/mocks/:mock_id/endpoints
{
	"name": "Incofisa",
	"author": "Gaston Fernandez",
	"httpRequest" : {
    	"method" : "GET",
    	"path" : "/connectors/api/v1/INCOFISA/ESP/v1",
    	"headers": {
			"Content-type": "application/json"
		}
	},
	"httpResponse" : {
		"body":{
			default_probability: 1,
			last_address_stay_duration: 0.2,
			phone_contact_probability: 0.2,
			scoring: 10,
			scoring_numeric: 10,
			credit_companies_queries: 4,
			known_addresses: 1,
			debt_recovery_companies_queries: 1,
			familiar_help_probability: 2
		},
		"headers": 
    		{
    			"Content-type": "application/json",
    			"Connection": "keep-alive"
    		},
		"status_code": 200
    }
}
````

### Delete a mock

This will delete the mock an all its endpoints 

````
DELETE /mock-server/mocks/:mock_id
````

### Get all Endpoints of a mock

````
GET /mock-server/mocks/:mock_id/endpoints

Response

  {
    "_id": "5cdf12957189542620d17b8e",
    "mock_id": "5cdf127e7189542dd2d17b8d",
    "name": "new endpoint",
    "author": "Gaston Fernandez",
    "httpRequest": {
      "path": "/api/v1/users/1",
      "method": "GET",
      "prefix": "/success"
    },
    "httpResponse": {
      "status_code": 200,
      "body": {
        "name": "Gaston",
        "last_name": "Fernandez"
      },
      "headers": {
        
      }
    },
    "creation_date": "2019-05-17T19:59:17.617Z",
    "last_update": "2019-05-17T19:59:17.617Z"
  }
]
````

### Get an Endpoint

````
GET /mock-server/mocks/:mock_id/endpoints/:endpoint_id

Response
  {
    "_id": "5cdf12957189542620d17b8e",
    "mock_id": "5cdf127e7189542dd2d17b8d",
    "name": "new endpoint",
    "author": "Gaston Fernandez",
    "httpRequest": {
      "path": "/api/v1/users/1",
      "method": "GET",
      "prefix": "/success"
    },
    "httpResponse": {
      "status_code": 200,
      "body": {
        "name": "Gaston",
        "last_name": "Fernandez"
      },
      "headers": {
        
      }
    },
    "creation_date": "2019-05-17T19:59:17.617Z",
    "last_update": "2019-05-17T19:59:17.617Z"
  }
````

### Update Endpoint
````
PUT /mock-server/mocks/:mock_id/endpoints/:endpoint_id
    {
        "name": "Identity Service mock"
    }
````

### Delete an endpoint

````
DELETE /mock-server/mocks/:mock_id/endpoints/endpoint
````

## How to use it local

-clone the repo
-npm i
-npm start
