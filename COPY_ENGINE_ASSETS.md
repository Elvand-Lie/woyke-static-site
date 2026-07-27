# WOYKE configurator engine asset setup

The static page now reads the original `options.ts`, `products.ts`, and preview resolver as browser ES modules.

Before deployment, copy the existing Next.js public asset folders into the root of this static project:

```text
yoke-jewellery/public/images/  ->  WOYKE_Static_HTML_Luxury_V4_Configurator/images/
yoke-jewellery/public/guides/  ->  WOYKE_Static_HTML_Luxury_V4_Configurator/guides/
```

Preserve spelling and letter case exactly, especially:

- `images/Necklace/`
- `images/Bracelet/`
- `images/Bangle/`
- `images/Brooch/`
- `images/Angklet/` (source spelling)

The configurator route is `/design/`. A product can be selected with a query parameter:

```text
/design/?product=imperial-jade-bloom-ring
/design/?product=classic-diamond-studs
```

Without a query parameter it defaults to `imperial-jade-bloom-ring`.
