import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney, listPublishedProducts } from "@/lib/catalogue";

export const metadata: Metadata = { title: "The Collection" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const value = (input: string | string[] | undefined) => typeof input === "string" ? input : "";

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = value(params.q);
  const category = value(params.category) || "all";
  const sort = value(params.sort) || "featured";
  const [products, allProducts] = await Promise.all([listPublishedProducts({ query, category, sort }), listPublishedProducts()]);
  const categories = [...new Map(allProducts.map((product) => [product.category.slug, product.category])).values()];

  return <main id="main">
    <section className="shop-campaign-hero" data-header-theme="light">
      <div className="shop-campaign-copy"><div className="section-kicker">Collection / guided starting points</div><h1>Objects with<br />somewhere to go.</h1><p className="lede">Begin from an existing form, then shape its material, stone and meaning.</p><a className="text-link dark" href="#collection-grid">Browse the collection <span>&darr;</span></a></div>
      <div className="shop-campaign-collage" aria-label="Featured jewellery"><figure className="shop-collage-main"><img src="/assets/media/images/jade-final-statement.webp" alt="Imperial Jade Bloom Ring" /></figure><figure><img src="/assets/media/images/necklace-heart.webp" alt="Heart necklace study" /></figure><figure><img src="/assets/media/images/bracelet-radiant.webp" alt="Radiant bracelet study" /></figure></div>
    </section>
    <section id="collection-grid" className="scene scene-ivory" data-header-theme="light"><div className="container">
      <form className="catalogue-toolbar"><label>Search<input name="q" type="search" defaultValue={query} placeholder="Name or category" /></label><label>Category<select name="category" defaultValue={category}><option value="all">All categories</option>{categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label><label>Sort<select name="sort" defaultValue={sort}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name</option></select></label><button className="btn btn-secondary" type="submit"><span>Apply</span></button></form>
      <p className="mono" aria-live="polite">{products.length} {products.length === 1 ? "piece" : "pieces"}</p>
      {products.length ? <div className="shop-grid">{products.map((product) => <article className="shop-card" key={product.id}><Link href={`/product/${product.slug}`}><div className="shop-card-media">{product.media[0] ? <img src={product.media[0].url} alt={product.media[0].altText} /> : null}</div><div className="shop-card-info"><div><p className="mono">{product.category.name}</p><h2>{product.name}</h2><p>{product.customizable ? "Customisable" : "Collection piece"}</p></div><span className="mono">{formatMoney(product.basePriceMinor, product.currency)}</span></div></Link></article>)}</div> : <div className="empty-state"><h2>No pieces match.</h2><p>Try another category or a shorter search.</p></div>}
    </div></section>
  </main>;
}