import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'collection',
    title: 'Collection',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Name',
            description: 'E.g. "Top Featured", "Weekend Reads"',
            type: 'string',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title' },
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2
        }),
        defineField({
            name: 'articles',
            title: 'Curated Articles',
            description: 'Drag and drop to reorder articles.',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'article' }] }],
            validation: (rule) => rule.unique()
        })
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'description'
        }
    }
})