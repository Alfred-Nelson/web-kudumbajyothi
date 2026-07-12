import { defineField, defineType } from 'sanity'
import { COLLECTION_LAYOUTS } from '../constants/collectionLayouts'
import LayoutSelectInput from '../components/LayoutSelectInput'
import { CuratedArticlesField, CuratedArticlesInput } from '../components/CuratedArticlesInput'
import { orderRankField } from '@sanity/orderable-document-list'

export default defineType({
    name: 'collection',
    title: 'Collection',
    type: 'document',
    fieldsets: [
        { name: 'titles', title: 'Titles & URL', options: { collapsible: true, collapsed: false } },
        { name: 'layout', title: 'Layout', options: { collapsible: true, collapsed: false } },
    ],
    fields: [
        defineField({ name: 'title', title: 'English Title', type: 'string', fieldset: 'titles', validation: (rule) => rule.required() }),
        defineField({ name: 'malayalamTitle', title: 'Malayalam Title', type: 'string', fieldset: 'titles', validation: (rule) => rule.required() }),
        defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, fieldset: 'titles', validation: (rule) => rule.required() }),
        defineField({ name: 'description', title: 'Short Description', type: 'text', rows: 3 }),
        orderRankField({ type: "collection" }),
        defineField({
            name: 'type',
            title: 'Type',
            fieldset: "layout",
            description: 'Choose how this collection is displayed. Preview is shown below.',
            type: 'string',
            options: {
                list: COLLECTION_LAYOUTS.map((l) => ({ title: l.title, value: l.value })),
            },
            initialValue: COLLECTION_LAYOUTS[0]?.value,
            components: {
                input: LayoutSelectInput,
            },
        }),
        defineField({
            name: 'articles',
            title: 'Curated Articles',
            description: 'Drag and drop to reorder articles. Add all articles you may want to show',
            type: 'array',
            of: [{
                type: 'reference', to: [{ type: 'article' }]
            }],
            validation: (rule) => rule.unique(),
            components: {
                input: CuratedArticlesInput,
                field: CuratedArticlesField,
            },
        }),
        defineField({
            name: 'layoutArticles',
            title: 'Articles in layout',
            type: 'array',
            fieldset: 'layout',

            readOnly: ({ document }) => {
                const curated =
                    (document?.articles as Array<{ _ref?: string }> | undefined) ?? []

                return curated.length === 0
            },

            of: [
                {
                    type: 'reference',
                    to: [{ type: 'article' }],
                    options: {
                        filter: ({ document }: any) => {
                            const curated =
                                (document?.articles as Array<{ _ref?: string }> | undefined) ?? []

                            const curatedIds = curated
                                .map((item) => item?._ref)
                                .filter((id): id is string => Boolean(id))
                                .map((id) => id.replace(/^drafts\./, ''))

                            if (!curatedIds.length) {
                                return { filter: 'false', params: {} }
                            }

                            return {
                                filter: '_id in $curatedIds',
                                params: { curatedIds },
                            }
                        },
                    },
                },
            ],

            validation: (rule) => rule.unique().max(10),
        })
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'description'
        }
    }
})