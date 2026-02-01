import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    fieldsets: [
        { name: 'names', title: 'Names & URL', options: { collapsible: true, collapsed: false } },
        { name: 'media', title: 'Category Image', options: { collapsible: true, collapsed: false } }
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'English Title',
            type: 'string',
            fieldset: 'names',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'malayalamTitle',
            title: 'Malayalam Title',
            type: 'string',
            fieldset: 'names',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title' },
            fieldset: 'names',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'customImage',
            fieldset: 'media'
        })
    ]
})