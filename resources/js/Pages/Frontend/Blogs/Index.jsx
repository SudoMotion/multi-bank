import BlogCard from '@/Components/Frontend/BlogCard';
import Container from '@/Components/Frontend/Container';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head } from '@inertiajs/react';

export default function Index({ blogs }) {
    return (
        <FrontendLayout>
            <Head title="My Money Matters" />

            <section className="bg-[#fafafa] py-16 sm:py-20">
                <Container>
                    <div className="mx-auto max-w-[1170px]">
                        <div className="text-center">
                            <h1 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-[2.5rem] sm:leading-tight">
                                My Money Matters
                            </h1>
                            <p className="mx-auto mt-5 max-w-5xl text-[15px] leading-relaxed text-neutral-700">
                                Articles and resources for you to take control of your financial
                                wellbeing, build confidence, and reach your life goals.
                            </p>
                        </div>

                        {blogs.length > 0 ? (
                            <div className="mt-10 grid gap-6 md:grid-cols-3 lg:gap-8">
                                {blogs.map((blog) => (
                                    <BlogCard key={blog.id} blog={blog} />
                                ))}
                            </div>
                        ) : (
                            <p className="mt-10 border border-neutral-300 bg-white px-6 py-12 text-center text-sm text-neutral-600">
                                No articles have been published yet.
                            </p>
                        )}
                    </div>
                </Container>
            </section>
        </FrontendLayout>
    );
}
