import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'customImage',
    title: 'Image',
    type: 'object',
    validation: (rule) =>
        rule.custom((value) => {
            if (value?.file && !value?.alt) {
                return {
                    message: 'Alt text is required when an image is provided.',
                    path: ['alt']
                }
            }
            return true
        }),
    fields: [
        defineField({
            name: 'file',
            title: 'File',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'alt',
            title: 'Alt Text (For Screen Readers)',
            type: 'string',
            // validation: (rule) => rule.required().error('Alt text is required for accessibility.')
        }),
        defineField({
            name: 'placement',
            title: 'Placement',
            type: "string",
            options: {
                list: "Background, Sides, Top, Bottom".split(", ").map((each) => ({ title: each, value: each.toLowerCase() })),
                layout: 'radio',
            },
            initialValue: "background"
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