const API_URL = 'https://randomuser.me/api';

export const fetchUsers = async (results = 1000) => {
  try {
    const response = await fetch(`${API_URL}?results=${results}&seed=windy&nat=us,gb,ca,au`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};