/**
 * CuratedArticlesInput  +  CuratedArticlesField
 *
 * Wire BOTH into your schema field:
 *
 *   defineField({
 *     name: 'articles',
 *     type: 'array',
 *     of: [{ type: 'reference', to: [{ type: 'article' }] }],
 *     components: {
 *       input: CuratedArticlesInput,
 *       field: CuratedArticlesField,
 *     },
 *   })
 *
 * ─── How the "Add article" button at the top works ───────────────────────────
 *
 * Sanity's component hierarchy for a field is:
 *
 *   Field  (title, description, validation)
 *     └─ Input  (the actual interactive widget)
 *
 * We need the "Add" button in the Field title row, but the correct
 * add-item API (onValueCreate + onItemPrepend) only exists inside Input props.
 *
 * Solution: a React context (PrependContext) acts as a bridge.
 *   1. CuratedArticlesField wraps everything in PrependContext.Provider
 *      and renders a title-row button that calls context.trigger().
 *   2. CuratedArticlesInput passes arrayFunctions={RegisterPrepend} to
 *      renderDefault. Sanity calls RegisterPrepend with onValueCreate and
 *      onItemPrepend; it immediately registers a trigger into context and
 *      renders nothing visible.
 *   3. Clicking the Field header button fires context.trigger(), which
 *      calls onValueCreate then onItemPrepend — the correct, error-free flow.
 *
 * ─── Why this flow produces no errors ────────────────────────────────────────
 *
 *   onValueCreate(schemaType.of[0])
 *     → produces { _type: 'reference', _key: '<uuid>' }   (no _ref yet)
 *   onItemPrepend(item)
 *     → inserts it at index 0
 *   Sanity sees an unresolved reference → opens picker dialog automatically
 *   User picks a document → valid _ref is committed to Content Lake
 *   No empty/invalid mutation ever reaches the API.
 */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import {
    ArrayInputFunctionsProps,
    ArrayOfObjectsInputProps,
    FieldProps,
    unset,
    useClient,
} from 'sanity'
import {
    Badge,
    Button,
    Card,
    Flex,
    Spinner,
    Stack,
    Text,
    TextInput,
} from '@sanity/ui'
import { AddIcon, LaunchIcon, SearchIcon, TrashIcon } from '@sanity/icons'

// ─── Context bridge ───────────────────────────────────────────────────────────

type PrependFn = () => void

const PrependContext = createContext<{
    register: (fn: PrependFn) => void
}>({
    register: () => { },
})

// ─── arrayFunctions replacement ───────────────────────────────────────────────
// Sanity passes this component: onValueCreate, onItemPrepend, schemaType, etc.
// We register the prepend logic into context so the Field button can call it,
// then render nothing — the visible button lives in the Field title row.

function RegisterPrepend(props: ArrayInputFunctionsProps) {
    const { onValueCreate, onItemPrepend, schemaType } = props
    const { register } = useContext(PrependContext)

    const trigger = useCallback(() => {
        const item = onValueCreate(schemaType.of[0])
        onItemPrepend(item)
    }, [onValueCreate, onItemPrepend, schemaType])

    useEffect(() => {
        register(trigger)
    }, [register, trigger])

    return null
}

// ─── CuratedArticlesInput  (components.input) ─────────────────────────────────

export function CuratedArticlesInput(props: ArrayOfObjectsInputProps) {
    const { value = [], onChange, renderDefault } = props
    const client = useClient({ apiVersion: '2024-01-01' })

    const [searchQuery, setSearchQuery] = useState('')
    const [articleData, setArticleData] = useState<
        Record<string, { title: string; slug?: string }>
    >({})
    const [loadingTitles, setLoadingTitles] = useState(false)

    // ── Stable ref IDs ─────────────────────────────────────────────────────
    const refIds = useMemo(
        () => (value || []).map((item: any) => item._ref).filter(Boolean),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify((value || []).map((v: any) => v._ref))]
    )

    // ── Fetch titles + slugs ───────────────────────────────────────────────
    useEffect(() => {
        if (!refIds.length) {
            setArticleData({})
            return
        }
        setLoadingTitles(true)
        client
            .fetch<{ _id: string; title: string; slug?: { current: string } }[]>(
                `*[_id in $ids]{ _id, title, slug }`,
                { ids: refIds }
            )
            .then((docs) => {
                const map: Record<string, { title: string; slug?: string }> = {}
                docs.forEach((d) => {
                    map[d._id] = { title: d.title, slug: d.slug?.current }
                })
                setArticleData(map)
            })
            .finally(() => setLoadingTitles(false))
    }, [refIds, client])

    // ── Delete by _key ─────────────────────────────────────────────────────
    const handleDelete = useCallback(
        (key: string) => {
            onChange(unset([{ _key: key }]))
        },
        [onChange]
    )

    // ── Search filter ──────────────────────────────────────────────────────
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return []
        const q = searchQuery.toLowerCase()
        return (value || []).filter((item: any) => {
            const title = articleData[item._ref]?.title ?? ''
            return (
                title.toLowerCase().includes(q) ||
                item._ref?.toLowerCase().includes(q)
            )
        })
    }, [value, articleData, searchQuery])

    return (
        <Stack space={3}>
            {/* Search box */}
            <TextInput
                icon={SearchIcon}
                placeholder="Search articles in this list…"
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.currentTarget.value)}
                clearButton={!!searchQuery}
                onClear={() => setSearchQuery('')}
            />

            {/* Search results */}
            {searchQuery && (
                <Card border radius={2} padding={3} tone="transparent">
                    <Stack space={2}>
                        <Flex align="center" gap={2}>
                            {loadingTitles ? (
                                <Spinner muted />
                            ) : (
                                <Badge
                                    tone={
                                        filteredItems.length ? 'primary' : 'caution'
                                    }
                                >
                                    {filteredItems.length} match
                                    {filteredItems.length !== 1 ? 'es' : ''}
                                </Badge>
                            )}
                            <Text size={1} muted>
                                — remove or open articles from here
                            </Text>
                        </Flex>

                        {filteredItems.length === 0 && !loadingTitles && (
                            <Text size={1} muted>
                                No articles match &ldquo;{searchQuery}&rdquo;
                            </Text>
                        )}

                        {filteredItems.map((item: any) => {
                            const article = articleData[item._ref]
                            return (
                                <Card
                                    key={item._key}
                                    padding={3}
                                    border
                                    radius={2}
                                    tone="default"
                                >
                                    <Flex
                                        align="center"
                                        justify="space-between"
                                        gap={3}
                                    >
                                        <Stack space={1} style={{ flex: 1 }}>
                                            <Text size={1} weight="semibold">
                                                {article?.title ?? (
                                                    <span style={{ opacity: 0.5 }}>
                                                        {item._ref}
                                                    </span>
                                                )}
                                            </Text>
                                            {article?.slug && (
                                                <Text size={0} muted>
                                                    /{article.slug}
                                                </Text>
                                            )}
                                        </Stack>
                                        <Flex gap={1}>
                                            {item._ref && (
                                                <Button
                                                    as="a"
                                                    // Adjust path to match your studio structure
                                                    href={`/studio/desk/article;${item._ref}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    icon={LaunchIcon}
                                                    mode="bleed"
                                                    tone="default"
                                                    padding={2}
                                                    fontSize={1}
                                                    title="Open article"
                                                />
                                            )}
                                            <Button
                                                icon={TrashIcon}
                                                mode="bleed"
                                                tone="critical"
                                                padding={2}
                                                fontSize={1}
                                                onClick={() =>
                                                    handleDelete(item._key)
                                                }
                                                title="Remove from list"
                                            />
                                        </Flex>
                                    </Flex>
                                </Card>
                            )
                        })}
                    </Stack>
                </Card>
            )}

            {/*
              Default array list.
              RegisterPrepend replaces the default "Add item" button:
              it registers the prepend trigger into PrependContext (provided
              by CuratedArticlesField above) and renders nothing visible.
            */}
            {renderDefault({
                ...props,
                arrayFunctions: RegisterPrepend,
            })}
        </Stack>
    )
}

// ─── CuratedArticlesField  (components.field) ─────────────────────────────────
// Renders a custom title row with "Add article" button, then the default
// field content (description + input) below — with no duplicate title.

export function CuratedArticlesField(props: FieldProps) {
    const { title, renderDefault } = props

    // A ref holds the latest prepend trigger registered by RegisterPrepend
    const triggerRef = useRef<PrependFn | null>(null)

    const register = useCallback((fn: PrependFn) => {
        triggerRef.current = fn
    }, [])

    const handleAdd = useCallback(() => {
        triggerRef.current?.()
    }, [])

    return (
        <PrependContext.Provider value={{ register }}>
            <Stack space={2}>
                {/* Title row with Add button */}
                <Flex align="center" justify="space-between">
                    <Text size={1} weight="semibold">
                        {title}
                    </Text>
                    <Button
                        icon={AddIcon}
                        text="Add article"
                        tone="primary"
                        mode="ghost"
                        fontSize={1}
                        padding={2}
                        onClick={handleAdd}
                    />
                </Flex>

                {/*
                  Render the default field content but strip the title so
                  Sanity doesn't render a second title below our custom one.
                */}
                {renderDefault({ ...props, title: undefined })}
            </Stack>
        </PrependContext.Provider>
    )
}