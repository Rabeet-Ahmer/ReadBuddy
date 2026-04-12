"use client";

import { IBook } from "@/types";
import { Mic, MicOff } from "lucide-react";
import Image from "next/image";
import { useVapi, CallStatus } from "@/hooks/useVapi";
import Transcript from "@/components/Transcript";
import { formatDuration } from "@/lib/utils";

const STATUS_CONFIG: Record<CallStatus, { dotClass: string; label: string }> = {
  idle: { dotClass: "vapi-status-dot-ready", label: "Ready" },
  connecting: { dotClass: "vapi-status-dot-connecting", label: "Connecting..." },
  starting: { dotClass: "vapi-status-dot-connecting", label: "Starting..." },
  listening: { dotClass: "vapi-status-dot-listening", label: "Listening" },
  thinking: { dotClass: "vapi-status-dot-thinking", label: "Thinking..." },
  speaking: { dotClass: "vapi-status-dot-speaking", label: "Speaking" },
};

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    status,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    maxDurationSeconds,
    remainingSeconds,
    showTimeWarning,
    limitError,
    start,
    stop,
    isActive,
  } = useVapi(book);

  const { dotClass, label } = STATUS_CONFIG[status];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Limit error banner */}
      {limitError && (
        <div className="error-banner">
          <div className="error-banner-content">
            <p className="text-red-700 text-sm font-medium">{limitError}</p>
          </div>
        </div>
      )}

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
            {(status === "thinking" || status === "connecting") && (
              <span className="vapi-pulse-ring" />
            )}
            <button
              type="button"
              onClick={isActive ? stop : start}
              disabled={status === "connecting"}
              className={`vapi-mic-btn ${isActive ? "vapi-mic-btn-active" : "vapi-mic-btn-inactive"}`}
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
            {/* Live status */}
            <div className="vapi-status-indicator">
              <span className={`vapi-status-dot ${dotClass}`} />
              <span className="vapi-status-text">{label}</span>
            </div>

            {/* Voice */}
            <div className="vapi-status-indicator">
              <span className="vapi-status-text">
                Voice: {book.persona || "rachel"}
              </span>
            </div>

            {/* Timer: elapsed / max */}
            <div className={`vapi-status-indicator ${showTimeWarning ? "bg-red-50! border-red-200!" : ""}`}>
              <span className={`vapi-status-text ${showTimeWarning ? "text-red-600!" : ""}`}>
                {formatDuration(duration)}/{formatDuration(maxDurationSeconds)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Time warning banner */}
      {showTimeWarning && (
        <div className="warning-banner">
          <div className="warning-banner-content">
            <span className="warning-banner-icon">&#9200;</span>
            <span className="warning-banner-text">
              Less than {remainingSeconds} seconds remaining — session will end automatically.
            </span>
          </div>
        </div>
      )}

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
