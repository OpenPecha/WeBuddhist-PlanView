import { useState } from "react"
import { Copy, Check } from "lucide-react"

const SAMPLE_URL =
    "https://your-domain.com/plan-id"

const Homepage = () => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(SAMPLE_URL)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
        }
    }

    return (
        <main className="sm:min-h-screen min-h-svh w-full flex flex-col justify-between items-center sm:p-2 p-4 bg-[#FAFAFA]">
            <div />
            <div className="flex flex-col items-center gap-10 sm:gap-20 w-full">
                <section className="w-full max-w-[640px] flex flex-col items-center text-center gap-4">
                    <h1 className="tracking-[-0.03em] text-xl sm:text-3xl font-serif leading-tight text-[#1a1a1a]">
                        View your Daily Plan
                    </h1>
                    <p className=" tracking-normal max-w-102 [white-space-collapse:preserve] text-sm sm:text-base text-[#707070]">
                        Plan Viewer is a web application that shows the preview for any We Buddhist
                        plan in a clean, shareable read-only view. Just paste the link with
                        your plan ID and a date.
                    </p>

                    <div className="w-full max-w-[480px]">
                        <div className="group flex items-center gap-3 rounded-full border border-[#ECECEC] bg-white pl-5 pr-2 py-2">
                            <span className="text-[15px] select-none text-[#9a9a9a]">
                                $
                            </span>
                            <code className="flex-1 truncate text-left text-sm font-mono text-[#1a1a1a]" title={SAMPLE_URL}>
                                {SAMPLE_URL}
                            </code>
                            <button onClick={handleCopy} aria-label="Copy URL" className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F2F2F2] transition-colors text-[#707070]">
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </section>

                <section className="w-full max-w-[520px] flex flex-col gap-4 sm:gap-6">
                    <h2 className="text-lg sm:text-xl font-serif tracking-[-0.02em] text-[#1a1a1a]">
                        How it works
                    </h2>
                    <ol className="flex flex-col gap-4">
                        {[
                            "Get your plan ID from We Buddhist after creating a plan",
                            "Open the URL — it loads the first day automatically, or add /YYYY-MM-DD for a specific date",
                            "Browse your day's tasks, sessions, and notes instantly",
                            "Share the link with anyone — it's read-only and works without an account",
                        ].map((step, i) => (
                            <li key={i} className="flex gap-4">
                                <span className="shrink-0 text-sm sm:text-base font-medium tabular-nums text-[#9a9a9a]">
                                    {i + 1}.
                                </span>
                                <span className="text-sm sm:text-base leading-[1.55] text-[#707070]">
                                    {step}
                                </span>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>

            <footer className="text-xs sm:text-sm text-[#9a9a9a]">
                Plan Viewer - A WeBuddhist Product
            </footer>
        </main>
    )
}

export default Homepage
