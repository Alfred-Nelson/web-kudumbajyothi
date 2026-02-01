import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'author',
    title: 'Author',
    type: 'document',
    fieldsets: [
        {
            name: 'basic',
            title: 'Basic Info',
            options: { collapsible: true, collapsed: false }
        }
    ],
    fields: [
        defineField({
            name: 'name',
            title: 'Name (English)',
            type: 'string',
            fieldset: 'basic',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'malayalamName',
            title: 'Name (Malayalam)',
            type: 'string',
            fieldset: 'basic',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'name' },
            fieldset: 'basic',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'profileImage',
            title: 'Profile Image',
            type: 'customImage',
        }),
        defineField({
            name: 'bio',
            title: 'Short Bio',
            type: 'text',
            rows: 3
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'malayalamName',
            media: 'profileImage.file'
        }
    }
})