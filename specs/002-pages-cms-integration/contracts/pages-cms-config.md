# Contract: `.pages.yml` (Pages CMS ⟷ repo interface)

This is the external interface for this feature: the config Pages CMS reads to render its
editing UI and to know which files/fields it's allowed to write back to the repo via
GitHub commits. It is the single source of truth both sides (CMS UI and Astro build) must
agree on — Astro's `content/config.ts` Zod schemas (see `data-model.md`) must stay a
superset-compatible match of these field definitions, or content saved by the CMS will
fail Astro's schema validation at build time.

Lives at the repo root as `.pages.yml`. Implementation phase creates the real file from
this contract — shown here in full since the field list *is* the interface.

```yaml
media:
  input: public/images
  output: /images

components:
  bilingual-text: &bilingual-text-fields
    - name: en
      label: English
      type: text
    - name: es
      label: Español
      type: text
  bilingual-text-required: &bilingual-text-fields-required
    - name: en
      label: English
      type: text
      required: true
    - name: es
      label: Español
      type: text
      required: true

content:
  - name: projects
    label: Projects
    type: collection
    path: src/content/projects
    filename: "{fields.slug}.yaml"
    fields:
      - name: slug
        label: Slug
        type: string
        required: true
        description: Stable identifier, used as the filename. Do not change after creation.
      - name: order
        label: Display order
        type: number
        required: true
        description: Lower numbers render first.
      - name: image
        label: Image
        type: image
        required: true
      - name: tags
        label: Tags
        type: string
        list: true
      - name: links
        label: Links
        type: object
        list: true
        fields:
          - name: type
            label: Link type
            type: select
            required: true
            options:
              values: [live-demo, github]
          - name: url
            label: URL
            type: string
            required: true
      - name: year
        label: Year
        type: string
        required: true
      - name: role
        label: Role
        type: object
        fields: *bilingual-text-fields
      - name: title
        label: Title
        type: object
        fields: *bilingual-text-fields-required
      - name: description
        label: Description
        type: object
        fields: *bilingual-text-fields-required
    view:
      primary: title.en
      fields: [image, order, year, tags]

  - name: experience
    label: Experience
    type: collection
    path: src/content/experience
    filename: "{fields.slug}.yaml"
    fields:
      - name: slug
        label: Slug
        type: string
        required: true
      - name: startDate
        label: Start date
        type: date
        required: true
      - name: endDate
        label: End date
        type: date
        description: Required unless "Current role" is checked.
      - name: isCurrent
        label: Current role
        type: boolean
      - name: title
        label: Title
        type: object
        fields: *bilingual-text-fields-required
      - name: company
        label: Company
        type: object
        fields: *bilingual-text-fields-required
      - name: description
        label: Description
        type: object
        fields: *bilingual-text-fields-required
    view:
      primary: company.en
      sort: startDate
      fields: [title.en, startDate, endDate]

  - name: blog
    label: Blog Posts
    type: collection
    path: src/content/blog
    filename: "{fields.slug}.md"
    fields:
      - name: title
        label: Title
        type: string
        required: true
      - name: date
        label: Date
        type: date
        required: true
      - name: banner
        label: Banner image
        type: image
        required: true
      - name: description
        label: Description
        type: text
        required: true
      - name: body
        label: Body
        type: rich-text

settings:
  merge: direct   # see research.md R6 — revisit if a second editor joins
```

**Notes on the YAML anchor usage above (`&bilingual-text-fields` / `*bilingual-text-fields`)**:
this doc uses a YAML anchor purely to show *which fields repeat*; confirm at
implementation time whether Pages CMS's parser supports YAML anchors/aliases across the
`components`/`content` boundary, or whether the `en`/`es` sub-fields must be inlined
under each `title`/`description`/`role`/`company` object instead. If anchors aren't
supported, the fallback is to inline the two-field (`en`, `es`) list on every occurrence
— functionally identical, just more repetition in the file.

## Compatibility requirement

Any field added to `.pages.yml` for `projects` or `experience` MUST have a matching Zod
field in `src/content/config.ts` (see `data-model.md`), and vice versa. A field present on
one side and missing on the other is the primary failure mode this contract guards
against (CMS lets an editor save a value Astro's build then rejects, or Astro expects a
field the CMS UI never exposes for editing).
