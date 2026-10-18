import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { getAuthContext } from "@/lib/auth";
import { formatMoney, getPublishedProduct } from "@/lib/catalogue";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const product = await getPublishedProduct((await params).slug); return { title: product?.name ?? "Piece not found" }; }

export default async function ProductPage({ params }: Props) {
  const product = await getPublishedProduct((await params).slug);
  if (!product) notFound();
  const auth = await getAuthContext();
  const image = product.media[0];
  return <main id="main"><section className="product-stage product-stage-v3" data-header-theme="dark"><div className="product-stage-media editorial-product-stage">{image ? <img src={image.url} alt={image.altText} /> : null}<div className="product-thumbs">{product.media.map((media) => <span className="product-thumb" key={media.url}><img src={media.url} alt="" /></span>)}</div></div><aside className="product-panel"><div className="section-kicker">{product.category.name}</div><h1>{product.name}</h1><p className="product-price">From {formatMoney(product.basePriceMinor, product.currency)}</p><p className="lede">{product.description}</p><div className="product-spec-list mono"><div><span>Category</span><strong>{product.category.name}</strong></div><div><span>Atelier</span><strong>Personalise the details</strong></div><div><span>Preview</span><strong>{image?.matchQuality ?? "representative"}</strong></div></div><div className="btn-row"><Link className="btn btn-light" href={`/design/?product=${encodeURIComponent(product.slug)}`}><span>Design this piece</span><span>+</span></Link><AddToCartButton authenticated={Boolean(auth)} product={{ id: product.id, slug: product.slug, name: product.name, priceMinor: product.basePriceMinor, image: image?.url ?? "", alt: image?.altText ?? product.name }} /></div></aside></section></main>;
}