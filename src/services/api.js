import axios from 'axios';
import {
    setupCache,
    buildMemoryStorage,
    defaultKeyGenerator,
    defaultHeaderInterpreter,
} from 'axios-cache-interceptor';

const axiosCache = setupCache(axios.create(), {
    storage: buildMemoryStorage(),
    generateKey: defaultKeyGenerator,
    headerInterpreter: defaultHeaderInterpreter,
    // debug: true,
});

const cacheConfig = {
    ttl: 1000 * 60 * 5,
    interpretHeader: false,
    methods: ['get'],
    cachePredicate: {
        statusCheck: (status) => status >= 200 && status < 400,
    },
    update: {},
    etag: false,
    modifiedSince: false,
    staleIfError: false,
};

const shouldCache = (body) => {
    const keys = Object.keys(body);
    if (!keys || keys.length === 0) return false;
    if (keys.includes('useCache') && body['useCache']) return true;
};

const apiService = {
    init() {
        axiosCache.defaults.baseURL = `${process.env.VUE_APP_BACK_END_URL}/api`;
    },

    setHeader(token) {
        axiosCache.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    async get(route, body = {}) {
        const cache = shouldCache(body) ? Object.assign({}, cacheConfig) : {};
        return await axiosCache.get(route, { cache });
    },

    async post(route, body) {
        return await axiosCache.post(route, body);
    },

    async put(route, body) {
        return await axiosCache.put(route, body);
    },

    async delete(route) {
        return await axiosCache.delete(route);
    },

    baseURL() {
        return `${process.env.VUE_APP_BACK_END_URL}/api`;
    },

    formatResult(success, data, error) {
        return {
            success,
            data: success ? data : null,
            error: success ? null : error,
        };
    },
};

export default apiService;
