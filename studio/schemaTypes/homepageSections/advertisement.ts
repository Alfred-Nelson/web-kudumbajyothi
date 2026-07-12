import { defineType, defineField } from "sanity"

export default defineType({
    name: "advertisementSection",
    title: "Advertisement Section",
    type: "object",
    fields: [
        defineField({
            name: "title",
            title: "Ad Title",
            type: "string"
        }),
        defineField({
            name: "image",
            title: "Advertisement Image",
            type: "customImage"
        }),
        defineField({
            name: "link",
            title: "Ad Link",
            type: "url"
        })
    ],
    preview: {
        select: {
            title: "title"
        },
        prepare({ title }) {
            return {
                title: title || "Advertisement"
            }
        }
    }
})