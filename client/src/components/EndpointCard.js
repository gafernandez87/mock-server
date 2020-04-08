import React from 'react'
import {Card, Tag, Button} from 'antd'

class EndpointCard extends React.Component{

    getColorByMethod = (method) => {
        switch(method){
            case "POST":
                return "blue"
            case "DELETE":
                return "red"
            case "GET":
                return "green"
            case "PATCH":
                return "orange"
            case "PUT":
                return "purple"
            default: 
                return "green"
        }
    }

    publishedPath = (prefix, path) =>{
        return `https://integrations.dev.fintechpeople.io:4443/mock-server${prefix}${path}`
    }

    getCardTitle = (name) => {
        return (<span>
            <span>{name}</span>
            <Button type="primary" shape="round"
                    style={{float: "right", cursor: "pointer"}} 
                    onClick={() => {this.props.cloneEndpoint()}}>
                    Clone
            </Button>
        </span>)
    }

    getStringBody = ({body, bodyType}) => {
        if(bodyType === "json"){
            return JSON.stringify(body, null, 2)
        }else {
            return body
        }
    }

    render(){
        const {index, endpoint, selectedId, prefix} = this.props

        let cardClasses = "endpointCard"
        if(selectedId === this.props.endpoint._id){
            cardClasses += " selected"
        }
        return(
            <Card
                key={index}
                title={this.getCardTitle(endpoint.name)}
                className={cardClasses}
                onClick={() => this.props.selectEndpoint(endpoint)}
            >
                <div>
                    <Tag 
                        key={index} 
                        closable={false}
                        color={this.getColorByMethod(endpoint.httpRequest.method)}>
                        {endpoint.httpRequest.method}
                    </Tag>
                    <span style={{fontWeight: 600}}>{endpoint.httpRequest.path}</span>
                </div>
                <p style={{fontWeight: 600}}>{endpoint.httpResponse.status_code}</p>
                <pre style={{backgroundColor: "#ffffff", border: "1px dashed #585858", padding: "5px"}}>
                    {endpoint.httpResponse.body}
                </pre>
                <span>Published path: </span>
                <a target="_blank" rel="noopener noreferrer" href={this.publishedPath(prefix,endpoint.httpRequest.path)}>
                <Tag style={{cursor: "pointer"}}  color="purple">{prefix}{endpoint.httpRequest.path}</Tag></a>
            </Card>
        )
    }
}

export default EndpointCard