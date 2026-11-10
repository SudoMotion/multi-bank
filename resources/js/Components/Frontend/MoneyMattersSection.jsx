import BlogCard from '@/Components/Frontend/BlogCard';
import Container from '@/Components/Frontend/Container';
import { Link } from '@inertiajs/react';

export default function MoneyMattersSection({ blogs }) {
    if (blogs.length === 0) {
        return null;
    }

    return (
        <section className="bg-[#fafafa] py-16 sm:py-20">
            <Container>
                <div className="mx-auto max-w-[1170px]">
                    <div className="text-center">
                        <h2 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-[2.5rem] sm:leading-tight">
                            My Money Matters
                        </h2>
                        <p className="mx-auto mt-5 max-w-5xl text-[15px] leading-relaxed text-neutral-700">
                            My Money Matters brings articles and resources for you to take control
                            of your financial wellbeing, build confidence, and reach your life goals.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-3 lg:gap-8">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Link
                            href={route('blogs.index')}
                            className="inline-flex h-11 items-center border border-[#006ac3] bg-white px-4 text-sm font-medium text-[#006ac3] transition-colors hover:bg-[#006ac3] hover:text-white"
                        >
                            Discover More
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
