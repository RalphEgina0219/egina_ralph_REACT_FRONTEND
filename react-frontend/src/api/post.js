import api from './axios';

export const getPost = async () => {
    return api.get('/posts');
}

export const storePost = async (Data) => {
    return api.post('/posts', Data);
}