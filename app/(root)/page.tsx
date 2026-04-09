import BookCard from "@/components/BookCard"
import HeroSection from "@/components/HeroSection"
import { getAllBooks } from "@/lib/actions/book.actions"
import { CreateBook } from "@/types"
import { Suspense } from "react"
import { cacheLife, cacheTag } from "next/cache"

const BookList = async () => {
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

import Loading from "@/app/loading"

const Page = () => {
  return (
    <main className="container wrapper">
      <HeroSection />
      <Suspense fallback={<Loading />}>
        <BookList />
      </Suspense>
    </main>
  )
}

export default Page