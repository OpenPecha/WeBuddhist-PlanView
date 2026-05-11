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

        </main>
    )
}

export default Homepage
