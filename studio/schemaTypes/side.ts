import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'side',
    title: 'Side',
    type: 'document',
    fields: [
        // --- TITLE SETTINGS ---
        defineField({
            name: 'title',
            title: 'Title',
            description: 'Add a title to either show or to identify the entity',
            type: 'string',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'showTitle',
            title: 'Show Title on Website?',
            description: 'Toggle ON to display the title above the content.',
            type: 'boolean',
            initialValue: true, // Default to showing it
        }),

        // --- CONTENT ---
        defineField({
            name: 'description',
            title: 'Content / Description',
            type: 'text',
            rows: 4
        }),

        // --- IMAGE (Clean & Flat) ---
        defineField({
            name: 'image',
            title: 'Side Image',
            type: 'customImage',
            // Removed the fieldset wrapper to keep it clean like Article
        })
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'description',
            media: 'image.file'
        }
    }
})