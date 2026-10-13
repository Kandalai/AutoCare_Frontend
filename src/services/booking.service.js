import axios from 'axios';
import authHeader from './auth-header';
import API_BASE_URL from './api-url';

const API_URL = `${API_BASE_URL}/bookings`;

const getMechanics = () => {
  return axios.get(API_URL + '/mechanics', { headers: authHeader() });
};

const createBooking = (vehicleId, serviceType, bookingDate, mechanicId) => {
  return axios.post(API_URL, { vehicleId, serviceType, bookingDate, mechanicId }, { headers: authHeader() });
};

const getMyBookings = () => {
  return axios.get(API_URL + '/my-bookings', { headers: authHeader() });
};

const getAllBookings = () => {
  return axios.get(API_URL + '/all', { headers: authHeader() });
};

const acceptBooking = (id) => {
  return axios.put(API_URL + `/${id}/accept`, {}, { headers: authHeader() });
};

const updateStatus = (id, status) => {
  return axios.put(API_URL + `/${id}/status?status=${status}`, {}, { headers: authHeader() });
};

const BookingService = {
  getMechanics,
  createBooking,
  getMyBookings,
  getAllBookings,
  acceptBooking,
  updateStatus
};

export default BookingService;
