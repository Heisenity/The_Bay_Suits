import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { posts } from "@/lib/data";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  return (
    <article className="section-pad">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="flex items-center gap-2 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> Back to journal</Link>
        <p className="eyebrow mt-14">{post.category}</p>
        <h1 className="mt-5 font-display text-6xl leading-[.95] md:text-8xl">{post.title}</h1>
        <p className="mt-8 text-xl leading-9 text-ink/55">{post.excerpt}</p>
        <div className="mt-12 space-y-7 border-t border-ink/10 pt-10 text-base leading-8 text-ink/65">
          <p>Choosing the right furnished stay begins with the way you plan to use the city. Access to work, transit, food and quiet can matter more than a few kilometres on a map.</p>
          <h2 className="font-display text-4xl text-ink">Start with the rhythm of your stay</h2>
          <p>Short leisure stays often benefit from walkable neighbourhoods close to restaurants and attractions. Longer professional stays usually call for practical details: a real workspace, groceries nearby, reliable transit and enough room to maintain a routine.</p>
          <h2 className="font-display text-4xl text-ink">Look beyond the listing</h2>
          <p>Professional management makes a meaningful difference when plans change. Confirm who supports the residence, how quickly they respond, and whether extensions, invoices and maintenance are handled by one accountable team.</p>
        </div>
      </div>
    </article>
  );
}
