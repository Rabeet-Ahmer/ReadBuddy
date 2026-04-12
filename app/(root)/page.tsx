import BookCard from "@/components/BookCard"
import HeroSection from "@/components/HeroSection"
import SearchBar from "@/components/SearchBar"
import { getAllBooks, searchBooks } from "@/lib/actions/book.actions"
import { CreateBook } from "@/types"
import { Suspense } from "react"
import { cacheLife, cacheTag } from "next/cache"

const AllBooks = async () => {
  "use cache";
  cacheLife("minutes");
  cacheTag("books-list");

  const result = await getAllBooks();
  const books = result.success ? result.data ?? [] : [];

  return (
    <div className="library-books-grid">
      {books.map((book: CreateBook & { _id: string, slug: string, coverURL: string }) => (
        <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug}/>
      ))}
    </div>
  )
}

const SearchResults = async ({ query }: { query: string }) => {
  const result = await searchBooks(query);
  const books = result.success ? result.data ?? [] : [];

  if (books.length === 0) {
    return (
      <p className="text-(--text-muted) text-center py-10">
        No books found for &ldquo;{query}&rdquo;
      </p>
    );
  }

  return (
    <div className="library-books-grid">
      {books.map((book: CreateBook & { _id: string, slug: string, coverURL: string }) => (
        <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug}/>
      ))}
    </div>
  )
}

import Loading from "@/app/loading"

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <main className="container wrapper">
      <HeroSection />

      <div className="library-header">
        <h2 className="library-heading">
          {query ? `Results for "${query}"` : "All Books"}
        </h2>
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      <Suspense fallback={<Loading />}>
        {query ? <SearchResults query={query} /> : <AllBooks />}
      </Suspense>
    </main>
  )
}

export default Page
