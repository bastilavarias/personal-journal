import Vue from 'vue';
import Vuex from 'vuex';
import journalModule from '@/store/modules/journal';
import systemModule from '@/store/modules/system';
import quoteModule from '@/store/modules/quote';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        system: systemModule,
        journal: journalModule,
        quote: quoteModule,
    },
});
