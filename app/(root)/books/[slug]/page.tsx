import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getBookBySlug } from "@/lib/actions/book.actions";
import { ArrowLeft } from "lucide-react";
import VapiControls from "@/components/VapiControls";

const BookPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect("/");
  }

  const book = result.data;

  return (
    <main className="book-page-container">
      {/* Floating back button */}
      <Link href="/" className="back-btn-floating" aria-label="Go back">
        <ArrowLeft className="w-5 h-5 text-[#212a3b]" />
      </Link>

        {/* Transcript Area */}
        <VapiControls book={book} />

    </main>
  );
};

export default BookPage;
