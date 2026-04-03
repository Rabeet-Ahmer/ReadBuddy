'use client'

const LoadingOverlay = () => {
    return (
        <div className="loading-wrapper">
            <div className="loading-shadow-wrapper bg-white">
                <div className="loading-shadow">
                    {/* Spinning book icon */}
                    <svg
                        className="loading-animation"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#663820"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>

                    <h3 className="loading-title">Synthesizing Your Book</h3>

                    <div className="loading-progress">
                        <div className="loading-progress-item">
                            <span className="loading-progress-status" />
                            <span className="text-[var(--text-secondary)]">Uploading and processing…</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadingOverlay
