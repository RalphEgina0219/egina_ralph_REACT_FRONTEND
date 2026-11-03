import api from './axios';

export const getProducts = async () => {
    return api.get('/products');
}

export const getProduct = async (slug) => {
    return api.get(`/products/${slug}`);
}
