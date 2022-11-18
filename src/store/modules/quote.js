import apiService from '@/services/api';

export const GET_FEATURED_QUOTE = 'quote/get-featured';

const quoteModule = {
    actions: {
        async [GET_FEATURED_QUOTE]() {
            try {
                const response = await apiService.get('/quote');
                const data = response.data.data;
                return apiService.formatResult(true, data);
            } catch (error) {
                console.log(error);
                return apiService.formatResult(
                    false,
                    null,
                    error.response.data.message
                );
            }
        },
    },
};

export default quoteModule;
