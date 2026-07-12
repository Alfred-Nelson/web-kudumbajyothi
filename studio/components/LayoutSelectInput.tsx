import React, { useCallback, useEffect } from 'react'
import { FormField, PatchEvent, set, unset } from 'sanity'
import { Box, Card, Grid, Stack } from '@sanity/ui'
import { COLLECTION_LAYOUTS } from '../constants/collectionLayouts'
import type { StringInputProps } from 'sanity'

const THUMB_SIZE = 80
const PREVIEW_MAX_WIDTH = 520

/**
 * Custom input for collection layout selection.
 * Shows layout options with thumbnails; selected layout's image is shown larger below.
 */
const LayoutSelectInput = React.forwardRef(function LayoutSelectInput(
  props: StringInputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { value, onChange, schemaType, readOnly } = props
  const layouts = COLLECTION_LAYOUTS

  // Auto-select first layout when there are layouts and no value
  useEffect(() => {
    if (layouts.length > 0 && (value === undefined || value === '')) {
      onChange(PatchEvent.from(set(layouts[0].value)))
    }
  }, [layouts.length, value, onChange])

  const handleSelect = useCallback(
    (layoutValue: string) => {
      if (readOnly) return
      onChange(PatchEvent.from(set(layoutValue)))
    },
    [onChange, readOnly]
  )

  const selectedLayout = layouts.find((l) => l.value === value)

  return (
    <FormField
      // title={schemaType?.title}
      // description={schemaType?.description}
      __unstable_presence={props.presence}
    >
      <Stack space={4} ref={ref}>
        {layouts.length === 0 ? (
          <Box padding={3}>
            <Card tone="caution" padding={3} radius={2}>
              No layouts defined. Add entries in <code>constants/collectionLayouts.ts</code>.
            </Card>
          </Box>
        ) : (
          <>
            <Grid columns={layouts.length} gap={2}>
              {layouts.map((layout) => {
                const isSelected = value === layout.value
                return (
                  <Card
                    key={layout.value}
                    padding={2}
                    radius={2}
                    tone={isSelected ? 'primary' : 'default'}
                    style={{
                      cursor: readOnly ? 'default' : 'pointer',
                      border: isSelected ? '2px solid var(--card-border-color)' : undefined,
                    }}
                    onClick={() => handleSelect(layout.value)}
                  >
                    <Stack space={2}>
                      <Box
                        style={{
                          width: THUMB_SIZE,
                          height: THUMB_SIZE,
                          overflow: 'hidden',
                          borderRadius: 4,
                          backgroundColor: 'var(--card-muted-bg-color)',
                        }}
                      >
                        <img
                          src={layout.image}
                          alt={layout.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            ; (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </Box>
                      <Box style={{ fontSize: 12, fontWeight: isSelected ? 600 : 400 }}>
                        {layout.title}
                      </Box>
                    </Stack>
                  </Card>
                )
              })}
            </Grid>

            {selectedLayout && (
              <Box paddingY={2}>
                <Box style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                  Preview: {selectedLayout.title}
                </Box>
                <Card padding={2} radius={2} style={{ maxWidth: PREVIEW_MAX_WIDTH }}>
                  <img
                    src={selectedLayout.image}
                    alt={`${selectedLayout.title} layout`}
                    style={{
                      width: '70%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: 4,
                    }}
                    onError={(e) => {
                      ; (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </Card>
              </Box>
            )}
          </>
        )}
      </Stack>
    </FormField>
  )
})

export default LayoutSelectInput
