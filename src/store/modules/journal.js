import apiService from '@/services/api';

export const GET_JOURNAL_ENTRIES = 'journal/get-entries';
export const CREATE_JOURNAL_ENTRY = 'journal/create-entry';
export const UPDATE_JOURNAL_ENTRY = 'journal/update-entry';
export const GET_JOURNAL_ENTRY = 'journal/get-entry';
export const SET_CURRENT_ENTRY = 'journal/set-current-entry';

const journalModule = {
    state: {
        currentEntry: null,
    },

    mutations: {
        [SET_CURRENT_ENTRY](state, payload) {
            state.currentEntry = Object.assign({}, payload);
        },
    },

    actions: {
        async [GET_JOURNAL_ENTRIES](_, payload) {
            try {
                const route = `${apiService.baseURL()}/topic`;
                const url = new URL(route);
                const params = new URLSearchParams(url.search);
                const { page, perPage, sortBy, orderBy } = payload;
                if (page) params.set('page', String(page));
                if (perPage) params.set('per_page', String(perPage));
                if (sortBy) params.set('sort_by', sortBy);
                if (orderBy) params.set('order_by', orderBy);
                const response = await apiService.get(`/journal?${params}`, {
                    useCache: true,
                });
                const collections = response.data.data;
                return apiService.formatResult(true, collections);
            } catch (error) {
                return apiService.formatResult(
                    false,
                    null,
                    error.response.data.message
                );
            }
        },

        async [CREATE_JOURNAL_ENTRY](_, payload) {
            try {
                const response = await apiService.post('/journal', payload);
                const data = response.data;
                return apiService.formatResult(true, data);
            } catch (error) {
                return apiService.formatResult(
                    false,
                    null,
                    error.response.data.message
                );
            }
        },

        async [GET_JOURNAL_ENTRY](_, slug) {
            try {
                const response = await apiService.get(`/journal/${slug}`);
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

        async [UPDATE_JOURNAL_ENTRY](_, payload) {
            try {
                const journalEntryID = payload.journalEntryID;
                payload._method = 'PUT';
                const response = await apiService.post(
                    `/journal/${journalEntryID}`,
                    payload
                );
                const data = response.data;
                return apiService.formatResult(true, data);
            } catch (error) {
                return apiService.formatResult(
                    false,
                    null,
                    error.response.data.message
                );
            }
        },
    },
};

export default journalModule;
