import { defineType, defineField } from "sanity"
import { COLLECTION_LAYOUTS } from "../../constants/collectionLayouts"
import LayoutSelectInput from "../../components/LayoutSelectInput"

export default defineType({
    name: "authorsSection",
    title: "Authors Section",
    type: "object",
    fields: [
        defineField({
            name: "title",
            title: "Section Title",
            type: "string",
            initialValue: "Authors"
        }),
        defineField({
            name: "malayalamTitle",
            title: "Malayalam Section Title",
            type: "string",
            initialValue: "ലേഖകർ"
        }),
        defineField({
            name: "showTitle",
            title: "Show Title?",
            type: "boolean",
            initialValue: true,
        }),
        defineField({
            name: 'layout',
            title: 'Layout',
            description: 'Choose the layout. Preview is shown below.',
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
            name: "authors",
            title: "Authors",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{ type: "author" }]
                }
            ]
        }),
    ],
    preview: {
        select: {
            title: "title"
        },
        prepare({ title }) {
            return {
                title: title || "Authors Section"
            }
        }
    }
})