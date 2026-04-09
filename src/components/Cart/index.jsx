import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProductsApi, PRODUCTS_CHANGED_EVENT } from "../../services/api";
import ProductCard, { ProductGridSkeleton } from "../ProductCard";
import { ErrorState } from "../StatusState";
import { showError } from "../../services/toast";

function SectionTitle({ title, description }) {
  return (
    <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
      <h2 className="text-[32px] font-black uppercase text-black sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-[640px] text-sm text-black/60 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ProductSection({ title, description, items }) {
  return (
    <section>
      <SectionTitle title={title} description={description} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-9 flex justify-center">
        <Link
          to="/shop/casual"
          className="inline-flex h-12 items-center rounded-full border border-black/10 px-12 text-sm font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
        >
          View All
        </Link>
      </div>
    </section>
  );
}

function DressStyleCard({ title, className = "" }) {
  return (
    <Link
      to={`/shop/${title.toLowerCase()}`}
      className={`group relative overflow-hidden rounded-[20px] bg-[#f2f0f1] p-6 transition duration-300 hover:-translate-y-1 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,0,0,0.08),_transparent_48%),linear-gradient(135deg,_rgba(255,255,255,0.2),_transparent_55%)]" />
      <div className="relative">
        <h3 className="text-3xl font-bold text-black">{title}</h3>
        <p className="mt-2 max-w-[220px] text-sm text-black/55">
          Curated pieces with clean lines, strong basics, and easy layering.
        </p>
        <span className="mt-8 inline-flex text-sm font-medium text-black/70 transition group-hover:text-black">
          Explore Collection →
        </span>
      </div>
    </Link>
  );
}

function Testimonials() {
  const items = [
    {
      name: "Sarah M.",
      quote:
        "I found pieces that look premium and actually feel comfortable all day. The quality surprised me.",
    },
    {
      name: "Alex K.",
      quote:
        "The product pages are clear, shipping was smooth, and the clothes matched the photos really well.",
    },
    {
      name: "James L.",
      quote:
        "Easy shopping experience and the styling feels modern without trying too hard. I’d absolutely come back.",
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="text-[32px] font-black uppercase text-black sm:text-5xl">
          Our Happy Customers
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.name}
            className="rounded-[20px] border border-black/10 bg-white p-6 transition hover:border-black/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
          >
            <p className="mb-4 text-[#f5b301]">★★★★★</p>
            <h3 className="mb-3 text-xl font-bold text-black">{item.name}</h3>
            <p className="text-sm leading-6 text-black/60">{item.quote}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Cart() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setProducts(await fetchProductsApi({ fromServer: true }));
      setError("");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "We couldn't load the latest products. Please verify the API base URL.";
      setError(message);
      showError(message, "Storefront load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    const onRefresh = () => fetchProducts();
    window.addEventListener("focus", onRefresh);
    window.addEventListener(PRODUCTS_CHANGED_EVENT, onRefresh);

    return () => {
      window.removeEventListener("focus", onRefresh);
      window.removeEventListener(PRODUCTS_CHANGED_EVENT, onRefresh);
    };
  }, [fetchProducts]);

  const sections = useMemo(() => {
    const ranked = [...products].sort(
      (left, right) => Number(right.rank || 0) - Number(left.rank || 0),
    );
    const discounted = [...products]
      .filter((item) => Number(item.discount || item.discountPercentage || 0) > 0)
      .sort(
        (left, right) =>
          Number(right.discount || right.discountPercentage || 0) -
          Number(left.discount || left.discountPercentage || 0),
      );

    return {
      arrivals: products.slice(0, 4),
      topSelling: (discounted.length > 0 ? discounted : ranked).slice(0, 4),
    };
  }, [products]);

  return (
    <div className="container py-12 sm:py-16">
      {loading ? (
        <>
          <SectionTitle
            title="New Arrivals"
            description="Fresh drops inspired by the visual direction in the design."
          />
          <ProductGridSkeleton count={4} />
          <div className="my-12 border-t border-black/10 sm:my-16" />
          <SectionTitle
            title="Top Selling"
            description="Popular pieces with the strongest ranking and discounts."
          />
          <ProductGridSkeleton count={4} />
        </>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProducts} />
      ) : (
        <>
          <ProductSection
            title="New Arrivals"
            description="Fresh pieces with clean silhouettes, soft neutrals, and polished everyday styling."
            items={sections.arrivals}
          />

          <div className="my-12 border-t border-black/10 sm:my-16" />

          <ProductSection
            title="Top Selling"
            description="Best-performing products pulled from the live catalog with real pricing and discount data."
            items={sections.topSelling}
          />

          <section className="mt-12 rounded-[40px] bg-[#f0f0f0] px-6 py-8 sm:mt-20 sm:px-16 sm:py-14">
            <SectionTitle title="Browse By Dress Style" />
            <div className="grid gap-4 lg:grid-cols-[1.1fr_1.45fr]">
              <DressStyleCard title="Casual" className="min-h-[190px]" />
              <DressStyleCard title="Formal" className="min-h-[190px]" />
              <DressStyleCard title="Party" className="min-h-[190px]" />
              <DressStyleCard title="Gym" className="min-h-[190px]" />
            </div>
          </section>

          <Testimonials />
        </>
      )}
    </div>
  );
}

export default Cart;
