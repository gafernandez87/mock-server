const js2xmlparser = require("js2xmlparser");
const routes = require("../routes")

function removePath(path, method){
    let index = -1
    routes.stack.forEach((route, i) => {
        if(route.route.path === path && route.route.methods[method] == true){
            index = i
        }
    });

    routes.stack.splice(index, 1)
}

function addRouteEndpoint(data, prefix="") {
    const { method, path } = data.httpRequest;
    const { body, status_code, headers } = data.httpResponse;

    (routes[method.toLowerCase()])(prefix+path, (_, res) => {
        if(status_code){
            res.status(status_code)
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

function addOrModifyRouteEndpoint(data, prefix) {
    const {path, method} = data.httpRequest
    removePath(prefix+path, method)
    //addRouteEndpoint(data, prefix)
    console.log(routes)
}


module.exports = {
    addOrModifyRouteEndpoint,
    addRouteEndpoint,
    removePath
}