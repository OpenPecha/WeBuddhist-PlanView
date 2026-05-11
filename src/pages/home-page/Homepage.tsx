import logo from "@/assets/icon/pecha-icon.png"
import { Separator } from "@/components/ui/separator"
import api from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/atom/select'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'


export const fetchTag = async (language: string) => {
    const { data } = await api.get("/api/v1/plans/tags", {
        params: {
            language: language,
        }
    })
    return data
}

const Homepage = () => {
    const [language, setLanguage] = useState('en')

    const { data, isLoading, error } = useQuery({
        queryKey: ['tags', language],
        queryFn: () => fetchTag(language),
    })

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage)
    }
    return (
        <main className="w-full bg-[#FAFAFA]">
            <div className="flex items-center gap-2 px-4 py-2">
                <img src={logo} alt="logo" className="w-10 h-10" />
                <p className="text-sm font-medium text-[#3D3D3A]">WeBuddhist </p>
                <Separator orientation="vertical" />
                <p className="text-sm text-[#3D3D3A]">Plan Viewer</p>
            </div>
            <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className=' w-fit'>
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">
                        English
                    </SelectItem>
                    <SelectItem value="zh">
                        Chinese
                    </SelectItem>
                    <SelectItem value="bo">
                        Tibetan
                    </SelectItem>
                </SelectContent>
            </Select>
            <div className="flex flex-col gap-2">
                {isLoading && <p>Loading tags...</p>}
                {error && <p>Error loading tags</p>}
                {data &&
                    data?.tags?.map((tag: string, index: number) => (
                        <div key={index}>
                            <p>{tag}</p>
                        </div>
                    ))
                }
            </div>
        </main>
    )
}

export default Homepage