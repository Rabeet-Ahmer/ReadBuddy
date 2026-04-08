"use client";

import { IBook } from "@/types";
import { Mic, MicOff } from "lucide-react";
import Image from "next/image";
import { useVapi } from "@/hooks/useVapi";
import Transcript from "@/components/Transcript";

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    status,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    limitError,
    start,
    stop,
    clearErrors,
    isActive,
    voice,
  } = useVapi(book);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header Card */}
      <div className="vapi-header-card">
        {/* Cover + Mic */}
        <div className="vapi-cover-wrapper">
          <Image
            src={book.coverURL}
            alt={book.title}
            width={130}
            height={195}
            className="vapi-cover-image"
          />
          <div className="vapi-mic-wrapper">
            {status === 'thinking' && (
              <span className="vapi-pulse-ring" />
            )}
            <button
              type="button"
              onClick={isActive ? stop : start}
              disabled={status === 'connecting'}
              className={`vapi-mic-btn ${isActive ? 'vapi-mic-btn-active' : 'vapi-mic-btn-inactive'}`}
              aria-label="Toggle microphone"
            >
              {isActive ? (
                <Mic className="w-6 h-6 text-[#663820]" />
              ) : (
                <MicOff className="w-6 h-6 text-[#ccc]" />
              )}
            </button>
          </div>
        </div>

        {/* Book info */}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#212a3b] font-serif leading-tight">
            {book.title}
          </h1>
          <p className="text-base text-[#3d485e]">by {book.author}</p>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <div className="vapi-status-indicator">
              <span className="vapi-status-dot vapi-status-dot-ready" />
              <span className="vapi-status-text">Ready</span>
            </div>
            <div className="vapi-status-indicator">
              <span className="vapi-status-text">
                Voice: {book.persona || "rachel"}
              </span>
            </div>
            <div className="vapi-status-indicator">
              <span className="vapi-status-text">0:00/15:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Area */}
      <div className="vapi-transcript-wrapper">
        <Transcript
          messages={messages}
          currentMessage={currentMessage}
          currentUserMessage={currentUserMessage}
        />
      </div>
    </div>
  );
};

export default VapiControls;
