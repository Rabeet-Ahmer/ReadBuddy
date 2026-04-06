'use server';

import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/bookSegment.model";

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

        console.log('Saving Book segments')

        const segmentsToSave = segments.map((s) => ({
            ...s, bookId, clerkId 
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

        await BookSegment.deleteMany({ bookId });
        await Book.findByIdAndDelete(bookId);

        console.error('Deleted Book segments and book due to failure to save segments')

        return {
            success: false,
            error: e
        }
    }
}

export const getAllBooks = async () => {
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