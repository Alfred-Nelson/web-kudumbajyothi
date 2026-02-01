import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'regular',
    title: 'Regular',
    type: 'document',
    fieldsets: [
        {
            name: 'info',
            title: 'Series Details',
            options: { collapsible: true, collapsed: false }
        }
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'English Title',
            type: 'string',
            fieldset: 'info',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'malayalamTitle',
            title: 'Malayalam Title',
            type: 'string',
            fieldset: 'info',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title' },
            fieldset: 'info',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'coverImage',
            title: 'Series Cover Image',
            type: 'customImage'
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text'
        }),
        // Keep this outside the fieldset for easy drag-and-drop
        defineField({
            name: 'parts',
            title: 'Articles in this Series (Ordered)',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'article' }] }]
        })
    ]
})