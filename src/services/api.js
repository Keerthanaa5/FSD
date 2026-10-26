const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('billflow_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Generic fetch wrapper with clean error handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Authentication
  auth: {
    login: (credentials) => request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    register: (userData) => request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    getMe: () => request('/auth/me')
  },

  // Customers API
  customers: {
    getAll: () => request('/customers'),
    getById: (id) => request(`/customers/${id}`),
    create: (customerData) => request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData)
    }),
    update: (id, customerData) => request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData)
    }),
    delete: (id) => request(`/customers/${id}`, {
      method: 'DELETE'
    })
  },

  // Products & Services API
  products: {
    getAll: () => request('/products'),
    getById: (id) => request(`/products/${id}`),
    create: (productData) => request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    }),
    update: (id, productData) => request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    }),
    delete: (id) => request(`/products/${id}`, {
      method: 'DELETE'
    })
  },

  // Invoices & Billing API
  invoices: {
    getAll: () => request('/invoices'),
    getById: (id) => request(`/invoices/${id}`),
    create: (invoiceData) => request('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData)
    }),
    update: (id, invoiceData) => request(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData)
    }),
    delete: (id) => request(`/invoices/${id}`, {
      method: 'DELETE'
    }),
    updatePayment: (id, paymentData) => request(`/invoices/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify(paymentData)
    })
  }
};

export default api;
