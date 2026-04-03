import z from 'zod';
import {
    MAX_FILE_SIZE,
    ACCEPTED_PDF_TYPES,
    MAX_IMAGE_SIZE,
    ACCEPTED_IMAGE_TYPES,
} from './constants';

export const UploadSchema = z.object({
    pdf: z
        .file()
        .check(
            z.maxSize(MAX_FILE_SIZE, 'PDF file must be under 50MB'),
            z.mime(ACCEPTED_PDF_TYPES, 'Only PDF files are accepted')
        ),
    cover: z
        .file()
        .check(
            z.maxSize(MAX_IMAGE_SIZE, 'Cover image must be under 10MB'),
            z.mime(ACCEPTED_IMAGE_TYPES, 'Only JPEG, PNG, or WebP images are accepted')
        )
        .optional(),
    title: z.string().min(1, 'Title is required').max(200, 'Title must be under 200 characters'),
    author: z.string().min(1, 'Author name is required').max(200, 'Author name must be under 200 characters'),
    voice: z.string().min(1, 'Please select a voice').default('rachel'),
});
