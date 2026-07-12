import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'
import { orderRankField } from '@sanity/orderable-document-list'

export default defineType({
    name: 'author',
    title: 'Author',
    type: 'document',
    icon: UsersIcon,
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
        orderRankField({ type: "collection" }),
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