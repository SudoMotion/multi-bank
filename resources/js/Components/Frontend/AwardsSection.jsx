import Container from '@/Components/Frontend/Container';

export default function AwardsSection({ awards }) {
    if (awards.length === 0) {
        return null;
    }

    return (
        <section className="bg-[#f3f7f8] py-12 sm:py-16">
            <Container>
                <div className="mx-auto grid max-w-[1170px] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:items-center lg:gap-10">
                    <h2 className="max-w-[16rem] text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-[2.125rem]">
                        RBC Awards <span className="whitespace-nowrap">&amp; Recognition</span>
                    </h2>

                    <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10">
                        {awards.map((award) => (
                            <div key={award.id} className="flex items-start gap-6">
                                {award.image_url && (
                                    <img
                                        src={award.image_url}
                                        alt=""
                                        className="h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28"
                                    />
                                )}
                                <div className="min-w-0">
                                    <h3 className="text-lg font-medium leading-snug text-neutral-900 sm:text-xl">
                                        {award.title}
                                    </h3>
                                    {award.description && (
                                        <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-neutral-700">
                                            {award.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
