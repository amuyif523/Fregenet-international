'use server'

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthEnv, getStripeEnv } from '@/lib/env';
import { createSessionToken } from '@/lib/session';
import { saveBoardImage, saveNewsletterCoverImage, saveProjectImage, saveReportFile, validateBoardImageFile } from '@/lib/upload';

// Error Prevention Guardrail: All Server Actions are kept in app/actions.ts
// Only export async functions from this file.

export async function exampleAction() {
    return { success: true };
}

export async function loginAdmin(formData: FormData) {
    const submittedPassword = formData.get('password');
    const password = typeof submittedPassword === 'string' ? submittedPassword : '';
    const { adminPassword, jwtSecret } = getAuthEnv();

    if (!adminPassword || !jwtSecret) {
        return { success: false, error: 'Server misconfiguration. Missing auth environment variables.' };
    }

    if (password !== adminPassword) {
        return { success: false, error: 'Invalid password. Please try again.' };
    }

    const token = await createSessionToken(jwtSecret);
    const cookieStore = await cookies();

    cookieStore.set('fregenet_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });

    redirect('/admin/dashboard');
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('fregenet_session');
    redirect('/login');
}

export async function subscribeToNewsletter(formData: FormData) {
    const rawEmail = formData.get('email');
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return { success: false, message: 'Please enter a valid email address.' };
    }

    await prisma.subscriber.upsert({
        where: { email },
        update: { status: 'active' },
        create: { email },
    });

    revalidatePath('/');
    return { success: true, message: 'Thank you for subscribing!' };
}

export async function deleteSubscriber(
    _prevState: DeleteActionState,
    formData: FormData
): Promise<DeleteActionState> {
    const rawId = formData.get('id');
    const id = typeof rawId === 'string' ? Number.parseInt(rawId, 10) : NaN;

    if (!Number.isFinite(id)) {
        return { success: false, message: 'Invalid subscriber id.' };
    }

    try {
        await prisma.subscriber.delete({ where: { id } });
    } catch {
        return { success: false, message: 'Subscriber could not be deleted.' };
    }

    revalidatePath('/admin/subscribers');
    return { success: true, message: 'Subscriber deleted.' };
}

type BoardMemberActionState = {
    success: boolean;
    message: string;
};

type DeleteActionState = {
    success: boolean;
    message: string;
};

type ReportActionState = {
    success: boolean;
    message: string;
};

type DonationActionState = {
    success: boolean;
    message: string;
};

type InquiryActionState = {
    success: boolean;
    message: string;
};

type ProjectActionState = {
    success: boolean;
    message: string;
};

type NewsletterActionState = {
    success: boolean;
    message: string;
};

function toSlug(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

const inquirySchema = z.object({
    name: z.string().trim().min(2, 'Please provide your full name.'),
    email: z.string().trim().email('Please provide a valid email.'),
    subject: z.enum(['General', 'Partnership', 'Volunteering']),
    message: z.string().trim().min(10, 'Message should be at least 10 characters long.'),
});

export async function upsertBoardMember(
    _prevState: BoardMemberActionState,
    formData: FormData
): Promise<BoardMemberActionState> {
    const idValue = formData.get('id');
    const id = typeof idValue === 'string' && idValue.trim() ? idValue.trim() : undefined;

    const nameValue = formData.get('name');
    const roleValue = formData.get('role');
    const bioValue = formData.get('bio');
    const imageFileValue = formData.get('image');
    const sortOrderValue = formData.get('sortOrder');

    const name = typeof nameValue === 'string' ? nameValue.trim() : '';
    const role = typeof roleValue === 'string' ? roleValue.trim() : '';
    const bio = typeof bioValue === 'string' ? bioValue.trim() : '';
    const sortOrder = typeof sortOrderValue === 'string' ? Number.parseInt(sortOrderValue, 10) : NaN;
    const imageFile = imageFileValue instanceof File && imageFileValue.size > 0 ? imageFileValue : null;

    if (!name || !role || !Number.isFinite(sortOrder)) {
        return { success: false, message: 'Name, role, and sort order are required.' };
    }

    if (!id && !imageFile) {
        return { success: false, message: 'Please upload a board member photo.' };
    }

    if (imageFile) {
        const validation = validateBoardImageFile(imageFile);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }
    }

    try {
        if (id) {
            const existingMember = await prisma.boardMember.findUnique({ where: { id } });

            if (!existingMember) {
                return { success: false, message: 'Board member not found.' };
            }

            const imageUrl = imageFile
                ? await saveBoardImage(imageFile, name)
                : existingMember.imageUrl;

            await prisma.boardMember.update({
                where: { id },
                data: { name, role, bio: bio || null, imageUrl, sortOrder },
            });
        } else {
            const imageUrl = await saveBoardImage(imageFile as File, name);

            await prisma.boardMember.create({
                data: { name, role, bio: bio || null, imageUrl, sortOrder },
            });
        }
    } catch {
        return { success: false, message: 'Unable to save board member. Ensure the name is unique.' };
    }

    revalidatePath('/admin/board');
    revalidatePath('/admin/dashboard');
    revalidatePath('/governance');

    return { success: true, message: 'Board member saved successfully.' };
}

export async function deleteBoardMember(
    _prevState: DeleteActionState,
    formData: FormData
): Promise<DeleteActionState> {
    const idValue = formData.get('id');
    const id = typeof idValue === 'string' ? idValue : '';

    if (!id) {
        return { success: false, message: 'Invalid board member id.' };
    }

    try {
        await prisma.boardMember.delete({ where: { id } });
    } catch {
        return { success: false, message: 'Board member could not be deleted.' };
    }

    revalidatePath('/admin/board');
    revalidatePath('/admin/dashboard');
    revalidatePath('/governance');

    return { success: true, message: 'Board member deleted.' };
}

export async function uploadReport(
    _prevState: ReportActionState,
    formData: FormData
): Promise<ReportActionState> {
    const titleValue = formData.get('title');
    const yearValue = formData.get('year');
    const categoryValue = formData.get('category');
    const isVerifiedValue = formData.get('isVerified');
    const fileValue = formData.get('file');

    const title = typeof titleValue === 'string' ? titleValue.trim() : '';
    const category = typeof categoryValue === 'string' ? categoryValue.trim() : '';
    const year = typeof yearValue === 'string' ? Number.parseInt(yearValue, 10) : NaN;
    const isVerified = isVerifiedValue === 'on';

    if (!title || !category || !Number.isFinite(year) || !(fileValue instanceof File)) {
        return { success: false, message: 'All fields are required and must be valid.' };
    }

    if (fileValue.type !== 'application/pdf') {
        return { success: false, message: 'Only PDF files are accepted.' };
    }

    const fileUrl = await saveReportFile(fileValue);

    await prisma.report.create({
        data: {
            title,
            year,
            category,
            fileUrl,
            isVerified,
        },
    });

    revalidatePath('/transparency');
    revalidatePath('/admin/reports');

    return { success: true, message: 'Report uploaded successfully.' };
}

export async function createCheckoutSession(
    _prevState: DonationActionState,
    formData: FormData
): Promise<DonationActionState> {
    const amountValue = formData.get('amount');
    const donorEmailValue = formData.get('donorEmail');

    const amount = typeof amountValue === 'string' ? Number.parseFloat(amountValue) : NaN;
    const donorEmail = typeof donorEmailValue === 'string' ? donorEmailValue.trim().toLowerCase() : '';

    if (!Number.isFinite(amount) || amount <= 0 || !donorEmail) {
        return { success: false, message: 'Please provide a valid donation amount and email.' };
    }

    const { stripeSecretKey, siteUrl } = getStripeEnv();

    if (!stripeSecretKey) {
        return { success: false, message: 'Stripe is not configured yet.' };
    }

    const stripe = new Stripe(stripeSecretKey);
    const baseUrl = siteUrl ?? 'http://localhost:3000';
    const amountInCents = Math.round(amount * 100);

    let session: Stripe.Checkout.Session;
    try {
        session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: donorEmail,
            success_url: `${baseUrl}/donate?success=1`,
            cancel_url: `${baseUrl}/donate?canceled=1`,
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: 'usd',
                        unit_amount: amountInCents,
                        product_data: {
                            name: 'Fregenet International Donation',
                            description: 'Support education, nutrition, and technology programs.',
                        },
                    },
                },
            ],
        });
    } catch {
        return { success: false, message: 'Stripe session could not be created. Verify your Stripe keys.' };
    }

    await prisma.donation.create({
        data: {
            amount,
            currency: 'USD',
            status: 'pending',
            donorEmail,
            stripeSessionId: session.id,
        },
    });

    if (!session.url) {
        return { success: false, message: 'Unable to initialize checkout session.' };
    }

    redirect(session.url);
}

export async function sendInquiry(
    _prevState: InquiryActionState,
    formData: FormData
): Promise<InquiryActionState> {
    const honeypot = formData.get('website');

    // Honeypot trap: bots tend to fill hidden fields while humans don't.
    if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
        return { success: true, message: 'Message sent successfully.' };
    }

    const parsed = inquirySchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
    });

    if (!parsed.success) {
        const issue = parsed.error.issues[0]?.message ?? 'Please check your form and try again.';
        return { success: false, message: issue };
    }

    await prisma.contactInquiry.create({
        data: {
            ...parsed.data,
            email: parsed.data.email.toLowerCase(),
        },
    });

    revalidatePath('/admin/inquiries');
    return { success: true, message: 'Message sent successfully.' };
}

export async function markInquiryAsRead(
    _prevState: DeleteActionState,
    formData: FormData
): Promise<DeleteActionState> {
    const idValue = formData.get('id');
    const id = typeof idValue === 'string' ? idValue : '';

    if (!id) {
        return { success: false, message: 'Invalid inquiry id.' };
    }

    try {
        await prisma.contactInquiry.update({
            where: { id },
            data: { status: 'read' },
        });
    } catch {
        return { success: false, message: 'Inquiry could not be updated.' };
    }

    revalidatePath('/admin/inquiries');
    return { success: true, message: 'Inquiry marked as read.' };
}

export async function deleteInquiry(
    _prevState: DeleteActionState,
    formData: FormData
): Promise<DeleteActionState> {
    const idValue = formData.get('id');
    const id = typeof idValue === 'string' ? idValue : '';

    if (!id) {
        return { success: false, message: 'Invalid inquiry id.' };
    }

    try {
        await prisma.contactInquiry.delete({ where: { id } });
    } catch {
        return { success: false, message: 'Inquiry could not be deleted.' };
    }

    revalidatePath('/admin/inquiries');
    return { success: true, message: 'Inquiry deleted.' };
}

export async function upsertProject(
    _prevState: ProjectActionState,
    formData: FormData
): Promise<ProjectActionState> {
    const idValue = formData.get('id');
    const id = typeof idValue === 'string' && idValue.trim() ? idValue.trim() : undefined;

    const titleValue = formData.get('title');
    const descriptionValue = formData.get('description');
    const categoryValue = formData.get('category');
    const imageUrlValue = formData.get('imageUrl');
    const imageFileValue = formData.get('imageFile');
    const statusValue = formData.get('status');
    const sortOrderValue = formData.get('sortOrder');

    const title = typeof titleValue === 'string' ? titleValue.trim() : '';
    const description = typeof descriptionValue === 'string' ? descriptionValue.trim() : '';
    const category = typeof categoryValue === 'string' ? categoryValue.trim() : 'General';
    const imageUrlInput = typeof imageUrlValue === 'string' ? imageUrlValue.trim() : '';
    const imageFile = imageFileValue instanceof File && imageFileValue.size > 0 ? imageFileValue : null;
    const status = typeof statusValue === 'string' && statusValue.trim() ? statusValue.trim().toLowerCase() : 'active';
    const sortOrder = typeof sortOrderValue === 'string' ? Number.parseInt(sortOrderValue, 10) : NaN;

    if (!title || !description || !category || !Number.isFinite(sortOrder)) {
        return { success: false, message: 'Title, description, category, and sort order are required.' };
    }

    if (status !== 'active' && status !== 'draft') {
        return { success: false, message: 'Status must be either active or draft.' };
    }

    try {
        if (id) {
            const existingProject = await prisma.project.findUnique({ where: { id } });

            if (!existingProject) {
                return { success: false, message: 'Project not found.' };
            }

            const imageUrl = imageFile
                ? await saveProjectImage(imageFile, title)
                : imageUrlInput || existingProject.imageUrl;

            await prisma.project.update({
                where: { id },
                data: { title, description, category, imageUrl, status, sortOrder },
            });
        } else {
            const imageUrl = imageFile
                ? await saveProjectImage(imageFile, title)
                : imageUrlInput;

            if (!imageUrl) {
                return { success: false, message: 'Please provide an external image URL or upload an image file.' };
            }

            await prisma.project.create({
                data: { title, description, category, imageUrl, status, sortOrder },
            });
        }
    } catch (error) {
        if (error instanceof Error && error.message) {
            return { success: false, message: error.message };
        }

        return { success: false, message: 'Unable to save project right now.' };
    }

    revalidatePath('/admin/projects');
    revalidatePath('/admin/dashboard');
    revalidatePath('/projects');

    return { success: true, message: 'Project saved successfully.' };
}

export async function deleteProject(formData: FormData) {
    const idValue = formData.get('id');
    const id = typeof idValue === 'string' ? idValue : '';

    if (!id) {
        return;
    }

    await prisma.project.delete({ where: { id } });

    revalidatePath('/admin/projects');
    revalidatePath('/admin/dashboard');
    revalidatePath('/projects');
}

export async function upsertNewsletter(
    _prevState: NewsletterActionState,
    formData: FormData
): Promise<NewsletterActionState> {
    const idValue = formData.get('id');
    const id = typeof idValue === 'string' && idValue.trim() ? idValue.trim() : undefined;

    const titleValue = formData.get('title');
    const slugValue = formData.get('slug');
    const publishedAtValue = formData.get('publishedAt');
    const excerptValue = formData.get('excerpt');
    const contentValue = formData.get('content');
    const fileUrlValue = formData.get('fileUrl');
    const imageFileValue = formData.get('image');
    const pdfFileValue = formData.get('pdfFile');

    const title = typeof titleValue === 'string' ? titleValue.trim() : '';
    const slugInput = typeof slugValue === 'string' ? slugValue.trim() : '';
    const slug = toSlug(slugInput || title);
    const excerpt = typeof excerptValue === 'string' ? excerptValue.trim() : '';
    const content = typeof contentValue === 'string' ? contentValue.trim() : '';
    const fileUrlInput = typeof fileUrlValue === 'string' ? fileUrlValue.trim() : '';
    const publishedAt = typeof publishedAtValue === 'string' && publishedAtValue.trim()
        ? new Date(publishedAtValue)
        : new Date();

    const imageFile = imageFileValue instanceof File && imageFileValue.size > 0 ? imageFileValue : null;
    const pdfFile = pdfFileValue instanceof File && pdfFileValue.size > 0 ? pdfFileValue : null;

    if (!title || !slug || !excerpt || !content || Number.isNaN(publishedAt.getTime())) {
        return { success: false, message: 'Title, slug, published date, excerpt, and content are required.' };
    }

    if (pdfFile && pdfFile.type !== 'application/pdf') {
        return { success: false, message: 'The optional newsletter file must be a PDF.' };
    }

    try {
        if (id) {
            const existing = await prisma.newsletter.findUnique({ where: { id } });

            if (!existing) {
                return { success: false, message: 'Newsletter not found.' };
            }

            const conflict = await prisma.newsletter.findUnique({ where: { slug } });
            if (conflict && conflict.id !== id) {
                return { success: false, message: 'Another newsletter already uses this slug.' };
            }

            const imageUrl = imageFile ? await saveNewsletterCoverImage(imageFile, title) : existing.imageUrl;
            const fileUrl = pdfFile
                ? await saveReportFile(pdfFile)
                : fileUrlInput || existing.fileUrl || null;

            await prisma.newsletter.update({
                where: { id },
                data: {
                    title,
                    slug,
                    publishedAt,
                    excerpt,
                    content,
                    imageUrl,
                    fileUrl,
                },
            });
        } else {
            if (!imageFile) {
                return { success: false, message: 'Please upload a cover image for this newsletter.' };
            }

            const conflict = await prisma.newsletter.findUnique({ where: { slug } });
            if (conflict) {
                return { success: false, message: 'Another newsletter already uses this slug.' };
            }

            const imageUrl = await saveNewsletterCoverImage(imageFile, title);
            const fileUrl = pdfFile ? await saveReportFile(pdfFile) : fileUrlInput || null;

            await prisma.newsletter.create({
                data: {
                    title,
                    slug,
                    publishedAt,
                    excerpt,
                    content,
                    imageUrl,
                    fileUrl,
                },
            });
        }
    } catch {
        return { success: false, message: 'Unable to save newsletter right now.' };
    }

    revalidatePath('/admin/newsletters');
    revalidatePath('/newsletter');

    return { success: true, message: 'Newsletter saved successfully.' };
}

export async function deleteNewsletter(
    _prevState: DeleteActionState,
    formData: FormData
): Promise<DeleteActionState> {
    const idValue = formData.get('id');
    const id = typeof idValue === 'string' ? idValue : '';

    if (!id) {
        return { success: false, message: 'Invalid newsletter id.' };
    }

    try {
        await prisma.newsletter.delete({ where: { id } });
    } catch {
        return { success: false, message: 'Newsletter could not be deleted.' };
    }

    revalidatePath('/admin/newsletters');
    revalidatePath('/newsletter');

    return { success: true, message: 'Newsletter deleted.' };
}
