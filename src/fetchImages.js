import axios from 'axios';
const API_KEY = '34746813-0de00557aa4b15a41a2766aed'

export default async function fetchImages(value, page) {
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${value}&page=${page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`
  
    return await axios.get(url).then(response => response.data);
  }