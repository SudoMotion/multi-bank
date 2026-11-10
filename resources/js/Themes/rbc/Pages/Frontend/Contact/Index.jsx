import ContactResultDialog from '@/Components/Frontend/ContactResultDialog';
import Container from '@/Components/Frontend/Container';
import SectionHeading from '@/Components/Frontend/SectionHeading';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import { Button, Card, Input, Textarea } from '@/Components/UI';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Index({ defaults = null }) {
    const { site, flash } = usePage().props;
    const [resultDialog, setResultDialog] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: defaults?.name ?? '',
        email: defaults?.email ?? '',
        phone: defaults?.phone ?? '',
        subject: '',
        message: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setResultDialog({
                type: 'success',
                message: flash.success,
            });
        } else if (flash?.error) {
            setResultDialog({
                type: 'error',
                message: flash.error,
            });
        }
    }, [flash?.success, flash?.error]);

    const resetFormFields = () => {
        setData({
            name: defaults?.name ?? '',
            email: defaults?.email ?? '',
            phone: defaults?.phone ?? '',
            subject: '',
            message: '',
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            preserveScroll: true,
            onSuccess: () => {
                resetFormFields();
            },
            onError: () => {
                setResultDialog({
                    type: 'error',
                    message:
                        'Your message could not be sent. Please review the highlighted fields and try again.',
                });
            },
        });
    };

    const closeResultDialog = () => {
        setResultDialog(null);
    };

    return (
        <FrontendLayout>
            <Head title="Contact Us" />

            <ContactResultDialog
                open={resultDialog !== null}
                type={resultDialog?.type}
                message={resultDialog?.message ?? ''}
                onClose={closeResultDialog}
            />

            <section className="border-b border-neutral-200 bg-neutral-50 py-14 sm:py-16">
                <Container>
                    <SectionHeading
                        eyebrow="Contact"
                        title="Get in touch"
                        description="Have a question or a project in mind? Send us a message and we will respond soon."
                    />
                </Container>
            </section>

            <section className="py-14 sm:py-16">
                <Container>
                    <div className="grid gap-10 lg:grid-cols-5">
                        <div className="lg:col-span-2">
                            <Card bodyClassName="p-5">
                                <h3 className="text-base font-medium text-neutral-900">
                                    Contact Information
                                </h3>
                                <dl className="mt-5 space-y-4 text-sm text-neutral-600">
                                    {site.email && (
                                        <div>
                                            <dt className="font-medium text-neutral-900">Email</dt>
                                            <dd className="mt-1">{site.email}</dd>
                                        </div>
                                    )}
                                    {site.phone && (
                                        <div>
                                            <dt className="font-medium text-neutral-900">Phone</dt>
                                            <dd className="mt-1">{site.phone}</dd>
                                        </div>
                                    )}
                                    {site.address && (
                                        <div>
                                            <dt className="font-medium text-neutral-900">Address</dt>
                                            <dd className="mt-1 whitespace-pre-line">{site.address}</dd>
                                        </div>
                                    )}
                                </dl>
                            </Card>

                            {site.google_map_embed_link && (
                                <Card className="mt-6 overflow-hidden" bodyClassName="p-0">
                                    <iframe
                                        title="Location map"
                                        src={site.google_map_embed_link}
                                        className="aspect-[4/3] w-full border-0"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </Card>
                            )}
                        </div>

                        <div className="lg:col-span-3">
                            <Card title="Send a Message">
                                <AdminForm onSubmit={submit}>
                                    <AdminFormGrid>
                                        <Input
                                            id="name"
                                            label="Name"
                                            value={data.name}
                                            error={errors.name}
                                            required
                                            onChange={(e) => setData('name', e.target.value)}
                                        />

                                        <Input
                                            id="email"
                                            label="Email"
                                            type="email"
                                            value={data.email}
                                            error={errors.email}
                                            required
                                            onChange={(e) => setData('email', e.target.value)}
                                        />

                                        <Input
                                            id="phone"
                                            label="Phone"
                                            type="tel"
                                            value={data.phone}
                                            error={errors.phone}
                                            required
                                            autoComplete="tel"
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />

                                        <Input
                                            id="subject"
                                            label="Subject"
                                            wrapperClassName="sm:col-span-2 lg:col-span-3 xl:col-span-4"
                                            value={data.subject}
                                            error={errors.subject}
                                            required
                                            onChange={(e) => setData('subject', e.target.value)}
                                        />

                                        <Textarea
                                            id="message"
                                            label="Message"
                                            wrapperClassName="sm:col-span-2 lg:col-span-3 xl:col-span-4"
                                            value={data.message}
                                            error={errors.message}
                                            required
                                            onChange={(e) => setData('message', e.target.value)}
                                        />
                                    </AdminFormGrid>

                                    <div className="mt-4 flex justify-end">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Sending…' : 'Send Message'}
                                        </Button>
                                    </div>
                                </AdminForm>
                            </Card>
                        </div>
                    </div>
                </Container>
            </section>
        </FrontendLayout>
    );
}
