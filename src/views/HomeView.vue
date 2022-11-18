<template>
    <div class="home" style="position: relative">
        <div class="header">
            <b-container class="pt-5">
                <div
                    class="d-flex justify-content-between align-items-center mb-2"
                >
                    <div>
                        <h1>Journal</h1>
                        <p>You have {{ totalEntries }} entries.</p>
                    </div>
                    <b-btn variant="primary" @click="toEditPage"> Today </b-btn>
                </div>

                <div
                    class="d-flex justify-content-center align-items-center"
                    :style="{ height: '12rem' }"
                    v-if="showQuoteBlock"
                >
                    <div
                        class="d-flex justify-content-center"
                        v-if="featuredQuote"
                    >
                        <blockquote class="blockquote fade-in">
                            <p class="mb-0 font-italic">
                                “{{ featuredQuote.content }}”
                            </p>
                            <footer class="blockquote-footer fade-in">
                                <cite :title="featuredQuote.author"
                                    >{{ featuredQuote.author }}
                                </cite>
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </b-container>
        </div>
        <b-container>
            <div class="entry-container">
                <b-row
                    v-masonry
                    origin-left="true"
                    horizontal-order="true"
                    transition-duration="0.3s"
                    item-selector=".item"
                    gutter="0"
                >
                    <template v-for="(entry, index) in entries">
                        <b-col
                            v-masonry-tile
                            class="item mb-3"
                            xs="3"
                            sm="6"
                            md="4"
                            :key="index"
                        >
                            <journal-entry-card
                                :entry="entry"
                                :key="index"
                            ></journal-entry-card>
                        </b-col>
                    </template>
                </b-row>
            </div>
        </b-container>
    </div>
</template>

<script>
import JournalEntryCard from '@/components/JournalEntryCard';
import {
    GET_JOURNAL_ENTRIES,
    GET_JOURNAL_ENTRY,
    SET_CURRENT_ENTRY,
} from '@/store/modules/journal';
import helperMixin from '@/mixins/helper';
import { GET_FEATURED_QUOTE } from '@/store/modules/quote';

export default {
    name: 'HomeView',

    components: { JournalEntryCard },

    data() {
        return {
            entries: [],
            totalEntries: 0,
            featuredQuote: null,
            showQuoteBlock: true,
        };
    },

    computed: {
        currentDate() {
            return this.$store.state.system.currentDate;
        },
    },

    methods: {
        async getJournalEntries() {
            const payload = {
                page: 1,
                perPage: 12,
                orderBy: 'desc',
                sortBy: 'created_at',
            };
            const result = await this.$store.dispatch(
                GET_JOURNAL_ENTRIES,
                payload
            );
            if (result.success) {
                this.totalEntries = result.data.total;
                this.entries = result.data.data;
            }
        },

        async toEditPage() {
            const dateSlug = helperMixin.toSlug(this.currentDate);
            const result = await this.$store.dispatch(
                GET_JOURNAL_ENTRY,
                dateSlug
            );
            if (result.success) {
                if (result.data) {
                    this.$store.commit(SET_CURRENT_ENTRY, result.data);
                    await this.$router.push({
                        name: 'writer',
                        query: { mode: 'edit', slug: result.data.slug },
                    });
                    return;
                }
                await this.$router.push({
                    name: 'writer',
                    query: { mode: 'new' },
                });
            }
        },

        async getFeaturedQuote() {
            this.featuredQuote = null;
            const result = await this.$store.dispatch(GET_FEATURED_QUOTE);
            if (result.success) {
                this.featuredQuote = Object.assign({}, result.data);
            }
        },

        handleScroll() {
            const scrollY = window.top.scrollY || 0;
            if (scrollY > 0) {
                this.showQuoteBlock = false;
                return;
            }
            this.showQuoteBlock = true;
        },
    },

    mounted() {
        setInterval(async () => await this.getFeaturedQuote(), 15000);
    },

    async created() {
        await this.getFeaturedQuote();
        await this.getJournalEntries();
        window.addEventListener('scroll', this.handleScroll);
    },

    destroyed() {
        window.removeEventListener('scroll', this.handleScroll);
    },
};
</script>

<style lang="scss" scoped>
.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
}

.fade-in {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 15000ms;
}

@keyframes fadeInOpacity {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

.entry-container {
    background-color: orangered;
    margin-top: 22rem;
}
</style>
