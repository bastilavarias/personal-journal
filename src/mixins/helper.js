const helperMixin = {
    toSlug(text) {
        text = text.replace(/^\s+|\s+$/g, ''); // trim
        text = text.toLowerCase();
        let from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
        let to = 'aaaaeeeeiiiioooouuuunc------';
        for (let i = 0, l = from.length; i < l; i++) {
            text = text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
        text = text
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        return text;
    },
};

export default helperMixin;
