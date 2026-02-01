import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'customImage',
    title: 'Image',
    type: 'object',
    fields: [
        defineField({
            name: 'file',
            title: 'File',
            type: 'image',
            options: { hotspot: true },
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'alt',
            title: 'Alt Text (For Screen Readers)',
            type: 'string',
            validation: (rule) => rule.required().error('Alt text is required for accessibility.')
        }),
        defineField({
            name: 'caption',
            title: 'Caption / Description',
            type: 'text',
            rows: 2
        })
    ],
    preview: {
        select: {
            imageUrl: 'file.asset.url',
            title: 'alt'
        }
    }
})