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
media: public/images

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
        description: Stable identifier, used as the filename. Do not change after creation.
      - name: image
        label: Image
        type: image
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
            options:
              values: [live-demo, github]
          - name: url
            label: URL
            type: string
      - name: year
        label: Year
        type: string
      - name: role
        label: Role
        type: object
        fields: *bilingual-text-fields
      - name: title
        label: Title
        type: object
        fields: *bilingual-text-fields
      - name: description
        label: Description
        type: object
        fields: *bilingual-text-fields
    view:
      primary: title.en
      fields: [image, year, tags]

  - name: experience
    label: Experience
    type: collection
    path: src/content/experience
    filename: "{fields.slug}.yaml"
    fields:
      - name: slug
        label: Slug
        type: string
      - name: startDate
        label: Start date
        type: date
      - name: endDate
        label: End date
        type: date
      - name: isCurrent
        label: Current role
        type: boolean
      - name: title
        label: Title
        type: object
        fields: *bilingual-text-fields
      - name: company
        label: Company
        type: object
        fields: *bilingual-text-fields
      - name: description
        label: Description
        type: object
        fields: *bilingual-text-fields
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
      - name: date
        label: Date
        type: date
      - name: banner
        label: Banner image
        type: image
      - name: description
        label: Description
        type: text
      - name: body
        label: Body
        type: rich-text

components:
  bilingual-text: &bilingual-text-fields
    - name: en
      label: English
      type: text
    - name: es
      label: Español
      type: text

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
