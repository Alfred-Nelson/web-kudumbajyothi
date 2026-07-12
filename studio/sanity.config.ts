import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import deskStructure from "./deskStructure"

export default defineConfig({
  name: 'default',
  title: 'studio',

  projectId: 'cnro1amk',
  dataset: 'production',

  plugins: [structureTool({
    structure: deskStructure
  }), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
