import { defineType, defineField } from "sanity"

export default defineType({
    name: "settings",
    title: "Settings",
    type: "document",
    fields: [
        defineField({
            name: "sections",
            title: "Homepage Sections",
            type: "array",
            description: "Add and reorder sections for the homepage",
            of: [
                { type: "collectionSection" },
                { type: "authorsSection" },
                { type: "regularsSection" },
                { type: "advertisementSection" }
            ]
        })
    ],
    validation: (Rule) =>
        Rule.custom((sections) => {
            if (!Array.isArray(sections)) return true

            const authorsCount = sections.filter(
                (s: any) => s._type === "authorsSection"
            ).length

            const regularsCount = sections.filter(
                (s: any) => s._type === "regularsSection"
            ).length

            if (authorsCount > 1) {
                return "Only one Authors section is allowed on the homepage"
            }

            if (regularsCount > 1) {
                return "Only one Regulars section is allowed on the homepage"
            }

            return true
        }),
    // --- ADD THIS BLOCK ---
    preview: {
        prepare() {
            return {
                title: 'Settings',
                subtitle: 'Manage homepage sections and layout'
            }
        }
    }
})


