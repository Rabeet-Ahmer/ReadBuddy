'use server';

import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { escapeRegex, generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/bookSegment.model";
import mongoose from "mongoose";
import { updateTag, cacheTag } from "next/cache";

export const checkBookExists = async (title: string) => {
    try {
        await connectToDatabase();

        const slug = generateSlug(title);

        const existingBook = await Book.findOne({slug}).lean();

        if (existingBook) {
            return {
                exists: true,
                data: serializeData(existingBook)
            }
        }

        return {
            exists: false,
        }
    } catch (e) {
        console.error('Error checking if book exists', e)
        return {
            exists: false,
            error: e
        }
    }
}

export const createBook = async (data: CreateBook) => {
    try {
        await connectToDatabase();

        const slug = generateSlug(data.title);

        const existingBook = await Book.findOne({slug}).lean();

        if (existingBook) {
            return {
                success: false,
                data: serializeData(existingBook),
                alreadyExists: true
            }
        }

        // Check Subscription limit before creating book.
        const book = await Book.create({...data, slug, totalSegments: 0});

        updateTag('books-list')

        return {
            success: true,
            data: serializeData(book)
        }
    } catch (e) {
        console.error('Error creating the book', e)
        return {
            success: false,
            error: e
        }
    }
}

export const saveBookSegments = async (bookId: string, clerkId: string, segments: TextSegment[]) => {
    try {
        await connectToDatabase();
        
    //     const { userId } = await auth();
    //     if (!userId) {
    //         return { success: false, error: 'Unauthorized' };
    //    }

    //     // Verify book ownership
    //     const book = await Book.findById(bookId).lean();
    //     if (!book || book.clerkId !== userId) {
    //         return { success: false, error: 'Book not found or access denied' };
    //     }

        console.log('Saving Book segments')

        const segmentsToSave = segments.map((segment) => ({
            ...segment, content: segment.content, bookId, clerkId 
        }))

        await BookSegment.insertMany(segmentsToSave);

        await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });

        console.log('Book Segments saved successfully')

        return {
            success: true,
            data: { segmentsCreated: segments.length }
        }

    } catch (e) {
        console.error('Error saving book segments', e)

        try {
            await BookSegment.deleteMany({ bookId });
            await Book.findByIdAndDelete(bookId);
            console.log('Cleaned up Book and segments due to failure')
        } catch (cleanupError) {
            console.error('Failed to clean up after segment\'s save failure:', cleanupError)
        }

        return {
            success: false,
            error: e
        }
    }
}

export const getAllBooks = async () => {
    'use cache';
    cacheTag('books-list');
    try {
        await connectToDatabase();

        const books = await Book.find().sort({ createdAt: -1 }).lean();

        return {
            success: true,
            data: serializeData(books)
        }
    } catch (e) {
        console.error('Error connecting to database', e)
        return {
            success: false,
            error: e
        }
    }
}

export const getBookBySlug = async (slug: string) => {
    try {
        await connectToDatabase();

        const book = await Book.findOne({ slug }).lean();

        if (!book) {
            return { success: false, data: null };
        }

        return {
            success: true,
            data: serializeData(book)
        }
    } catch (e) {
        console.error('Error fetching book by slug', e)
        return {
            success: false,
            data: null,
            error: e
        }
    }
}

export const searchBookSegments = async (bookId: string, query: string, limit: number = 5) => {
    try {
        await connectToDatabase();

        console.log(`Searching for: "${query}" in book ${bookId}`);

        const bookObjectId = new mongoose.Types.ObjectId(bookId);

        // Try MongoDB text search first (requires text index)
        let segments: Record<string, unknown>[] = [];
        try {
            segments = await BookSegment.find({
                bookId: bookObjectId,
                $text: { $search: query },
            })
                .select('_id bookId content segmentIndex pageNumber wordCount')
                .sort({ score: { $meta: 'textScore' } })
                .limit(limit)
                .lean();
        } catch (error) {
            console.error('Text search failed:', error);
            segments = [];
        }

        // Fallback: regex search matching ANY keyword
        if (segments.length === 0) {
            const keywords = query.split(/\s+/).filter((k) => k.length > 2);
            if (keywords.length === 0) {
                return {
                    success: true,
                    data: [],
                };
            }
            const pattern = keywords.map(escapeRegex).join('|');

            segments = await BookSegment.find({
                bookId: bookObjectId,
                content: { $regex: pattern, $options: 'i' },
            })
                .select('_id bookId content segmentIndex pageNumber wordCount')
                .sort({ segmentIndex: 1 })
                .limit(limit)
                .lean();
        }

        console.log(`Search complete. Found ${segments.length} results`);

        return {
            success: true,
            data: serializeData(segments),
        };
    } catch (error) {
        console.error('Error searching segments:', error);
        return {
            success: false,
            error: (error as Error).message,
            data: [],
        };
    }
};