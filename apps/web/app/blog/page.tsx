import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { posts } from "@/lib/data";

export default function BlogPage() {
  return (
    <>
      <PageHero eyebrow="The Bay Journal" title="Stay well informed." description="Neighbourhood notes, corporate travel guidance and practical insight for furnished-rental owners." />
      <section className="section-pad">
        <div className="container-wide grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article key={post.slug} className="flex min-h-[360px] flex-col rounded-[1.75rem] border border-ink/10 bg-white p-8">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-champagne">{post.category}</p>
              <span className="mt-6 font-display text-7xl text-ink/10">0{index + 1}</span>
              <h2 className="mt-auto font-display text-3xl leading-8">{post.title}</h2>
              <p className="mt-4 text-sm leading-6 text-ink/50">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-6 flex items-center gap-2 text-sm font-bold">Read article <ArrowUpRight className="h-4 w-4" /></Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
