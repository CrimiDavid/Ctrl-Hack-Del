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

export const createCommunityEvent = async (eventData: object) => {
    // Endpoint for creating a community event
    const endpoint = '/api/createEvent';
    // POST request to create a community event
    const response = await apiClient.post(endpoint, eventData);
    // Return the response data
    return response.data;
}

export const getCommunityEvents = async () => {

}

export const getCommunityEvent = async () => {

}

export const createCommunity = async (communityData: object) => {
    // Endpoint for creating a community
    const endpoint = '/api/createCommunity';
    // POST request to create a community
    const response = await apiClient.post(endpoint, communityData);
    // Return the response data
    return response.data;
}

export const getCommunities = async () => {

}

export const getCommunity = async () => {

}

