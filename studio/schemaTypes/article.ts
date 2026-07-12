import { defineField, defineType } from 'sanity'
import { BillIcon } from '@sanity/icons'

export default defineType({
    name: 'article',
    title: 'Article',
    type: 'document',
    icon: BillIcon,
    fieldsets: [
        { name: 'titles', title: 'Titles & URL', options: { collapsible: true, collapsed: false } },
        { name: 'settings', title: 'Settings', options: { columns: 1 } },
        { name: 'extras', title: 'Sidebar / Extras', options: { collapsible: true, collapsed: false } }
    ],
    fields: [
        // --- TITLES & SETTINGS  ---
        defineField({ name: 'title', title: 'English Title', type: 'string', fieldset: 'titles', validation: (rule) => rule.required() }),
        defineField({ name: 'malayalamTitle', title: 'Malayalam Title', type: 'string', fieldset: 'titles', validation: (rule) => rule.required() }),
        defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, fieldset: 'titles', validation: (rule) => rule.required() }),
        defineField({ name: 'description', title: 'Short Description', type: 'text', rows: 3 }),
        defineField({ name: 'mainImage', title: 'Main Image', type: 'customImage' }),

        // --- SETTINGS & SIDEBAR  ---
        defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', fieldset: 'settings', initialValue: () => new Date().toISOString() }),
        defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'author' }], fieldset: 'settings', validation: (rule) => rule.required() }),
        defineField({ name: 'categories', title: 'Categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }], fieldset: 'settings' }),
        defineField({ name: 'series', title: 'Part of Series', type: 'reference', to: [{ type: 'regular' }], fieldset: 'settings' }),
        defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, fieldset: 'settings' }),


        defineField({
            name: 'contentLayout',
            title: 'Article Body',
            description: 'Add and reorder text, ads, and sides to build the page.',
            type: 'array',
            of: [
                // 1. RTE
                {
                    type: 'block',
                    title: 'Text Block',
                },
                // 2. Reference to Side Notes 
                {
                    type: 'reference',
                    name: 'sideNoteReference',
                    title: 'Side Note / Snippet',
                    options: {},
                    to: [{ type: 'side' }],
                },
                {
                    type: 'object',
                    name: 'adComponent',
                    title: 'Google Ad Slot',
                    options: {},
                    fields: [
                        {
                            name: 'adFormat',
                            title: 'Ad Format',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Display Ad (Standard)', value: 'display' },
                                    { title: 'In-feed Ad', value: 'in-feed' },
                                    { title: 'In-article Ad', value: 'in-article' },
                                ],
                            },
                            initialValue: 'in-article'
                        },
                        {
                            name: 'label',
                            title: 'Admin Label',
                            type: 'string',
                            description: 'Just to identify this ad component (e.g., "Ad after intro")'
                        }
                    ],
                    // This makes the ad look distinct in the Sanity Studio list
                    preview: {
                        select: { label: 'label', format: 'adFormat' },
                        prepare({ label, format }) {
                            return {
                                title: `Google Ad: ${label || format}`,
                                subtitle: 'This will render a Google Ad script here'
                            }
                        }
                    }
                },
            ]
        }),
    ],
    preview: {
        select: {
            title: 'malayalamTitle',
            subtitle: 'description',
            authorName: 'author.malayalamName',
            media: 'mainImage.file'
        },
        prepare(selection) {
            const { title, subtitle, authorName, media } = selection
            return {
                title: title,
                subtitle: `${subtitle || ''} ${authorName ? `— ${authorName}` : ''}`,
                media: media
            }
        }
    }
})