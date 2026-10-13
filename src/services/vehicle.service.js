import axios from 'axios';
import authHeader from './auth-header';
import API_BASE_URL from './api-url';

const API_URL = `${API_BASE_URL}/vehicles`;

const getVehicles = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getAllVehicles = () => {
  return axios.get(API_URL + '/all', { headers: authHeader() });
};

const getVehicle = (id) => {
  return axios.get(API_URL + `/${id}`, { headers: authHeader() });
};

const addVehicle = (make, model, year, licensePlate, mileage, color, vin, imageUrl) => {
  return axios.post(
    API_URL,
    { make, model, year, licensePlate, mileage, color, vin, imageUrl },
    { headers: authHeader() }
  );
};

const deleteVehicle = (id) => {
  return axios.delete(API_URL + `/${id}`, { headers: authHeader() });
};

const VehicleService = {
  getVehicles,
  getVehicle,
  addVehicle,
  deleteVehicle,
};

export default VehicleService;
