import BlogCard from '@/Components/Frontend/BlogCard';
import Container from '@/Components/Frontend/Container';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ blog, relatedBlogs }) {
    return (
        <FrontendLayout>
            <Head title={blog.title} />

            <article className="bg-white py-12 sm:py-16">
                <Container>
                    <div className="">
                        <Link
                            href={route('blogs.index')}
                            className="text-sm text-[#006ac3] hover:underline"
                        >
                            &larr; My Money Matters
                        </Link>

                        {blog.headline && (
                            <p className="mt-6 text-sm font-bold uppercase tracking-wide text-[#006ac3]">
                                {blog.headline}
                            </p>
                        )}

                        <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-[2.5rem]">
                            {blog.title}
                        </h1>

                        {blog.published_at && (
                            <p className="mt-4 text-sm text-neutral-500">{blog.published_at}</p>
                        )}
                    </div>

                    {blog.image_url && (
                        <img
                            src={blog.image_url}
                            alt={blog.title}
                            className="mx-auto mt-8 aspect-[2.45/1] w-full max-w-5xl object-cover"
                        />
                    )}

                    {blog.description && (
                        <div className="mx-auto mt-10 max-w-3xl whitespace-pre-line text-base leading-relaxed text-neutral-700 sm:text-[17px]">
                            {blog.description}
                        </div>
                    )}
                </Container>
            </article>

            {relatedBlogs.length > 0 && (
                <section className="bg-[#fafafa] py-14 sm:py-16">
                    <Container>
                        <div className="mx-auto max-w-[1170px]">
                            <h2 className="text-center text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl">
                                More from My Money Matters
                            </h2>

                            <div className="mt-8 grid gap-6 md:grid-cols-3 lg:gap-8">
                                {relatedBlogs.map((item) => (
                                    <BlogCard key={item.id} blog={item} />
                                ))}
                            </div>
                        </div>
                    </Container>
                </section>
            )}
        </FrontendLayout>
    );
}
