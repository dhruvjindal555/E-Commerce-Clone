const API_URL = 'https://apni-dukaan-3555.onrender.com/order'; 

export const fetchOrders = async () => {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authToken':window.localStorage.getItem('authToken')
        },
    });
    if (!response.ok) {
        throw new Error(response.message);
    }
    return await response.json();
};

export const createOrder = async (orderData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // authentication headers 
            'authToken': window.localStorage.getItem('authToken')
        },
        body: JSON.stringify(orderData),
    });
    const data = await response.json();
    console.log(data);    
    return data
};

export const updateOrder = async (orderId, updatedData) => {
    const response = await fetch(`${API_URL}/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authToken':window.localStorage.getItem('authToken')
        },
        body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
        throw new Error('Failed to update order');
    }
    return await response.json();
};

export const deleteOrder = async (orderId) => {
    const response = await fetch(`${API_URL}/${orderId}`, {
        method: 'DELETE',
        headers: {
            'authToken':window.localStorage.getItem('authToken')
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete order');
    }
};
