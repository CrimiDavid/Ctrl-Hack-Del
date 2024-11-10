import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://161.35.248.173:8000/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;

export const getUserLocation = async () => {

}

export const setUserLocation = async (location: UserLocation) => {
    // Endpoint for updating user location
    const endpoint = '/api/setAddress';
    // POST request to update user location
    const response = await apiClient.post(endpoint, location);
    // Return the response data
    return response.data;
}

export const getCommunityPins = async () => {

}

export const getCommunityPin = async () => {

}

export const getWeather = async () => {

}

export const getCommunityEvents = async () => {

}

export const getCommunityEvent = async () => {

}

export const getCommunities = async () => {

}

export const getCommunity = async () => {

}

