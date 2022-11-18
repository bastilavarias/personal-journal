<template>
    <div class="writer">
        <b-container class="py-5" v-if="bootPage">
            <div class="mb-5">
                <h1>{{ displayDate }}</h1>
                <p>Write your reflection today. Be grateful. Be kind.</p>
                <router-link :to="{ name: 'home' }">
                    <small style="color: black"
                        ><u>Back to Entries...</u></small
                    >
                </router-link>
            </div>

            <b-form-textarea
                class="c-textarea mb-5"
                autofocus
                rows="20"
                :disabled="isSaveStart"
                v-model="content"
            >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius,
                harum.
            </b-form-textarea>

            <b-btn
                variant="primary"
                block
                size="lg"
                class="rounded"
                :disabled="!isContentValid || isSaveStart"
                @click="onSave"
            >
                {{ saveButtonText }}
            </b-btn>
        </b-container>
    </div>
</template>

<script>
import moment from 'moment';
import {
    GET_JOURNAL_ENTRY,
    CREATE_JOURNAL_ENTRY,
    UPDATE_JOURNAL_ENTRY,
} from '@/store/modules/journal';

export default {
    data() {
        return {
            bootPage: false,
            content: null,
            isSaveStart: false,
            saveButtonText: 'Save',
            displayDate: null,
            currentEntry: null,
        };
    },

    computed: {
        mode() {
            return this.$route.query.mode || 'new';
        },
        slug() {
            return this.$route.query.slug || null;
        },
        isContentValid() {
            return !!this.content;
        },
        currentDate() {
            return this.$store.state.system.currentDate;
        },
    },

    watch: {
        isSaveStart(value) {
            if (value) {
                this.saveButtonText = 'Saving...';
            }
        },
    },

    methods: {
        async onSave() {
            if (this.mode === 'new') {
                await this.createEntry();
                return;
            }
            await this.updateEntry();
        },

        async createEntry() {
            const payload = {
                title: this.displayDate,
                content: this.content.trim(),
            };
            this.isSaveStart = true;
            const result = await this.$store.dispatch(
                CREATE_JOURNAL_ENTRY,
                payload
            );
            if (result.success) {
                this.saveButtonText = `Journal was saved!`;
                setTimeout(() => window.open('/', '_self'), 1000);
            }
        },

        async updateEntry() {
            const payload = {
                journalEntryID: this.currentEntry.id,
                content: this.content.trim(),
            };
            this.isSaveStart = true;
            const result = await this.$store.dispatch(
                UPDATE_JOURNAL_ENTRY,
                payload
            );
            if (result.success) {
                this.saveButtonText = `Journal was updated!`;
                setTimeout(() => window.open('/', '_self'), 1000);
            }
        },

        async getEntry() {
            const currentEntryFromStore =
                this.$store.state.journal.currentEntry || null;
            const assignEntry = (data) => {
                this.currentEntry = Object.assign({}, data);
                const { content, title } = this.currentEntry;
                this.displayDate = title;
                this.content = content;
            };
            if (currentEntryFromStore) {
                assignEntry(currentEntryFromStore);
                return;
            }
            const result = await this.$store.dispatch(
                GET_JOURNAL_ENTRY,
                this.slug
            );
            if (result.success) {
                if (!result.data) {
                    return;
                }
                assignEntry(result.data);
            }
        },
    },

    async created() {
        if (this.mode === 'edit') {
            if (!this.slug) {
                await this.$router.go(-1);
            }
            await this.getEntry();
            this.bootPage = true;
            return;
        }
        this.displayDate = this.currentDate;
        this.bootPage = true;

        // Finish infinite loading
        // Finish dynamic quote generator and cron job
    },
};
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.c-textarea {
    padding: 1rem;
    background-color: $primary-light;
    border-color: $primary;
}
</style>
