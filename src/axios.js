import axios from 'axios';
import ApiConstants from './_apis_/ApiConstants'

const instance = axios.create({
  // baseURL: 'http://localhost:3001/dev'
  baseURL: ApiConstants.BASE_URL
});

export default instance;
