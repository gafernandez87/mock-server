const js2xmlparser = require("js2xmlparser");
const routes = require("../routes")

function removePath(path, method){
    /*
    let routes = app._router.stack;
    routes.forEach(removeMiddlewares);
    function removeMiddlewares(route, i, routes) {
        if(route.route){
            if(route.route.path === path && route.route.methods[method]){
                routes.splice(i, 1);
                route.route.stack.forEach(removeMiddlewares);
            }
        }
        
    }
    */
}

function addRouteEndpoint(data) {
    const { method, path } = data.httpRequest;
    const { body, statusCode, headers } = data.httpResponse;

    (routes[method.toLowerCase()])(path, (_, res) => {
        if(statusCode){
            res.status(statusCode)
        }
        
        let isXml = false
        if(headers) {
            let keys = Object.keys(headers)
            keys.forEach(key => {
                if(headers[key].indexOf("xml") != -1){
                    isXml = true
                }

                res.set(key, headers[key])
            })
        }

        if(body){
            if(isXml){
                res.send(js2xmlparser.parse("body", body))
            }else{
                res.send(body)
            }
        }else{
            res.send("")
        }
    })
}

function addOrModifyRouteEndpoint(data) {
    const {path, method} = data.httpRequest
    removePath(path, method)
    addRouteEndpoint(data)
}


module.exports = {
    addOrModifyRouteEndpoint,
    addRouteEndpoint
}