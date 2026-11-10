import Container from '@/Components/Frontend/Container';

export default function BranchLocatorSection() {
    return (
        <section
            id="branch-locator"
            className="bg-[#dfe3e8] bg-cover bg-top bg-no-repeat py-8 sm:py-10"
            style={{ backgroundImage: "url('/images/branch-locator-map.jpg')" }}
        >
            <Container>
                <div className="mx-auto max-w-[800px] border border-neutral-300 bg-white px-5 py-6 shadow-[0_1px_4px_rgba(0,0,0,0.12)] sm:px-8 sm:py-7">
                    <h2 className="text-2xl font-medium tracking-tight text-neutral-900 sm:text-[1.875rem]">
                        Find a Branch or ATM Near You
                    </h2>

                    <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-4">
                        <label htmlFor="branch-locator-search" className="block text-[13px] text-neutral-800">
                            Search by address, city, postal code, or transit number:
                        </label>
                        <div className="mt-2 flex">
                            <input
                                id="branch-locator-search"
                                type="search"
                                className="h-12 min-w-0 flex-1 border border-r-0 border-neutral-500 px-3 text-[15px] focus:border-[#006ac3] focus:ring-1 focus:ring-[#006ac3]"
                            />
                            <button
                                type="submit"
                                className="h-12 shrink-0 bg-[#005daa] px-5 text-sm font-medium text-white transition-colors hover:bg-[#004a88]"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </Container>
        </section>
    );
}
