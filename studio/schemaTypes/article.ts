import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'article',
    title: 'Article',
    type: 'document',
    fieldsets: [
        { name: 'titles', title: 'Titles & URL', options: { collapsible: true, collapsed: false } },
        // REMOVED "media" fieldset from here
        { name: 'settings', title: 'Settings', options: { columns: 1 } },
        { name: 'extras', title: 'Sidebar / Extras', options: { collapsible: true, collapsed: false } }
    ],
    fields: [
        // --- GROUP 1: TITLES ---
        defineField({
            name: 'title',
            title: 'English Title',
            type: 'string',
            fieldset: 'titles',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'malayalamTitle',
            title: 'Malayalam Title',
            type: 'string',
            fieldset: 'titles',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title' },
            fieldset: 'titles',
            validation: (rule) => rule.required()
        }),

        // --- STANDALONE ---
        defineField({
            name: 'description',
            title: 'Short Description',
            type: 'text',
            rows: 3,
        }),

        // --- IMAGE (No Fieldset Needed) ---
        // The customImage type ALREADY creates a box for File + Alt + Caption
        defineField({
            name: 'mainImage',
            title: 'Main Image',
            type: 'customImage',
            // Removed fieldset: 'media'
        }),

        // --- GROUP 2: SETTINGS ---
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            fieldset: 'settings',
            initialValue: () => new Date().toISOString()
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
            fieldset: 'settings',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'categories',
            title: 'Categories',
            description: 'Select one or more categories (e.g. Faith, Healthcare)',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
            fieldset: 'settings',
            validation: (rule) => rule.unique()
        }),
        defineField({
            name: 'series',
            title: 'Part of Series',
            type: 'reference',
            to: [{ type: 'regular' }],
            fieldset: 'settings'
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
            fieldset: 'settings'
        }),

        // --- STANDALONE BODY ---
        defineField({
            name: 'body',
            title: 'Article Body',
            type: 'array',
            of: [{ type: 'block' }]
        }),

        // --- GROUP 3: EXTRAS ---
        defineField({
            name: 'relatedSides',
            title: 'Sidebar Snippets',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'side' }] }],
            fieldset: 'extras'
        })
    ]
})