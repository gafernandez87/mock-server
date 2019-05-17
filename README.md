# MOCK SERVER

Create a mock
````
POST /mocks
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


Create endpoint
````
POST /mocks/:mock_id/endpoints
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
