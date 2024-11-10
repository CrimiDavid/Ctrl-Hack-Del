import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://161.35.248.173:8000/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;

export const getUserLocation = async (userId: string) => {
    // Endpoint for getting user location
    const endpoint = `/api/getUserInfo/${userId}/`;
    // GET request to get user location
    const response = await apiClient.get(endpoint);
    console.log(response.data)
    // Return the response data
    return response.data;
}

export const setUserLocation = async (userId: string, location: Partial<UserLocation>) => {
    // Endpoint for updating user location
    const endpoint = '/api/setUserLocation/';
    // Debug print
    console.log(userId, location)
    // POST request to update user location
    const response = await apiClient.post(endpoint, {
        user_id: userId,
        city: location.city,
        region: location.region,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
        latitude_delta: 0.0922,
        longitude_delta: 0.0421
    });
    // Return the response data
    return response.data;
}

export const getCommunityPins = async () => {
    // Endpoint for getting community pins
    const endpoint = '/api/getCommunityPins/';
    // GET request to get community pins
    const response = await apiClient.get(endpoint);
    // Return the response data
    return response.data;
}

export const getCommunityPin = async () => {

}

export const getWeather = async () => {

}

export const createCommunityEvent = async (eventData: object) => {
    // Endpoint for creating a community event
    const endpoint = '/api/createEvent/';
    // POST request to create a community event
    const response = await apiClient.post(endpoint, eventData);
    // Return the response data
    return response.data;
}

export const getCommunityEvents = async (userId: string) => {
    // Endpoint for getting community events
    const endpoint = `/api/getAvailableEvents/${userId}/`;
    // GET request to get community events
    const response = await apiClient.get(endpoint);
    // Return the response data
    return response.data;
}

export const getCommunityEvent = async () => {

}

export const createCommunity = async (communityData: object) => {
    // Endpoint for creating a community
    const endpoint = '/api/createCommunity/';
    // POST request to create a community
    const response = await apiClient.post(endpoint, communityData);
    // Return the response data
    return response.data;
}

export const getCommunities = async () => {

}

export const getCommunity = async () => {

}

