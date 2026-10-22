# WordPress hosting

The live catalogue is https://solenich.kz. WordPress installs the `solonich-catalog` theme; the catalogue and its two administrators continue to use Supabase. WordPress accounts do not grant catalogue access.

## Release

1. Run `npm run lint`, `npm run build` and `npm run build:wordpress`.
2. The WordPress build prints the release directory under ignored `data/wordpress/`. Only Git-tracked public assets are packaged. Stage new public assets before building.
3. Zip the generated `solonich-catalog` directory, including the directory itself at the archive root.
4. In WordPress, open Appearance → Themes → Add Theme → Upload Theme. Upload the ZIP and replace the installed Solonich Catalog theme.
5. Verify the public home page, a product URL, the sign-in page, images, favicon, mobile footer, `/sitemap.xml` and the three legacy redirects.

GitHub pushes deploy the Vercel preview only. They do not update this WordPress installation.

## Rollback

Keep the previous release ZIP locally and upload it through the same theme-update flow to restore a previous catalogue release. The inactive `solenich-anniversary` theme can also be activated to restore the former holding page. Changing themes does not delete WordPress content or Supabase catalogue data.

## Routing and SEO

The theme serves the generated public HTML with assets under `/wp-content/themes/solonich-catalog/build/`. Public routes have individual canonical metadata. Private routes are excluded from indexing and use `no-store`. Unknown URLs return HTTP 404.

Legacy `/contact`, `/catalog` and `/category/glavnaya` URLs return permanent redirects to the corresponding landing-page sections. Google updates existing search results after recrawling; installation does not immediately remove cached snippets or icons.

The square `site-icon.png` is the public favicon. Set the same logo in WordPress General Settings for dashboard and WordPress surfaces. Product metadata uses each product's name and Kazakhstan; Almaty is identified as the production location. Do not add invented city-specific availability or keyword clouds.
