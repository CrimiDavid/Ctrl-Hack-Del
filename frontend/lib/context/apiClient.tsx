import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://161.35.248.173:8000/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;

export const setUserAddress = async () => {
    
}

export const getUserLocation = async () => {

}

export const setUserLocation = async () => {
    
}

export const getCommunityPins = async () => {

}

export const getCommunityPin = async () => {

}

