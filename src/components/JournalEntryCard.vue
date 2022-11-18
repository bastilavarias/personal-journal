<template>
    <b-card border-variant="dark">
        <div class="d-flex justify-content-between mb-3">
            <small>{{ entry.title }}</small>
            <div>
                <small class="mb-0" @click="toEditPage" style="cursor: pointer"
                    ><u>Edit..</u></small
                >
            </div>
        </div>
        {{ entry.content }}
    </b-card>
</template>

<script>
export default {
    name: 'journal-entry-card',

    props: {
        entry: {
            type: Object,
            required: true,
        },
    },

    methods: {
        toEditPage() {
            this.$router.push({
                name: 'writer',
                query: { mode: 'edit', slug: this.entry.slug },
            });
        },
    },
};
</script>
