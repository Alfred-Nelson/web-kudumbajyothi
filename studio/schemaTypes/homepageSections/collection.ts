import { defineType, defineField } from "sanity"
import { COLLECTION_LAYOUTS } from "../../constants/collectionLayouts"
import LayoutSelectInput from "../../components/LayoutSelectInput"

export default defineType({
    name: "collectionSection",
    title: "Collection Section",
    type: "object",
    fields: [
        defineField({
            name: "collection",
            title: "Collection",
            type: "reference",
            to: [{ type: "collection" }],
            validation: (Rule) => Rule.required()
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
    ],
    preview: {
        select: {
            title: "collection.title"
        },
        prepare({ title }) {
            return {
                title: title || "Collection Section",
                subtitle: "Homepage Section"
            }
        }
    }
})