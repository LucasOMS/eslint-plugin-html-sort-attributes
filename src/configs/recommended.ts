export default {
    plugins: [
        'html-sort-attributes',
    ],
    rules: {
        'html-sort-attributes/order': [
            'error',
            {
                alphabetical: true,
                order: [],
            },
        ],
    },
} ;
