import axios from 'axios';
import Constants from '../config/Constants'

class MockService {
    getAll(){
        return axios.get(`${Constants.API_URL}/mocks`)
    }

    get(mockId){
        console.log("getting mock " + mockId + " _" + Constants.API_URL)
        return axios.get(`${Constants.API_URL}/mocks/${mockId}`)
    }
    
    create(data){
        return axios.post(`${Constants.API_URL}/mocks`, data)
    }

    update(mockId, data){
        return axios.put(`${Constants.API_URL}/mocks/${mockId}`, data)
    }

    remove(mockId){
        return axios.delete(`${Constants.API_URL}/mocks/${mockId}`)
    }

    clone(mockId){
        return axios.get(`${Constants.API_URL}/mocks/${mockId}/clone`)
    }
}

export default new MockService()




