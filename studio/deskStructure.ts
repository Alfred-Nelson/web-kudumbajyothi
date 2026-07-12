
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { StructureResolverContext, type StructureBuilder, type StructureResolver } from 'sanity/structure'
import { UsersIcon, VersionsIcon } from '@sanity/icons'

const deskStructure: StructureResolver = (S: StructureBuilder, context: StructureResolverContext) =>
    S.list()
        .title('Base')
        .items([
            orderableDocumentListDeskItem({ type: 'collection', S, context, title: "Collection", icon: VersionsIcon }),
            orderableDocumentListDeskItem({ type: "author", S, context, title: "Author", icon: UsersIcon, }),
            S.listItem()
                .title('Site Settings')
                .child(
                    S.document()
                        .title("settings")
                        .schemaType('settings')
                        .documentId('settings')),
            ...S.documentTypeListItems().filter((item) => !(['collection', "settings", "author"].includes(item.getId()!)))
        ])

export default deskStructure