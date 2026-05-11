import api from "@/lib/api"
import Header from "@/components/ui/molecules/header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/atom/select'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import TagCard from "@/components/ui/molecules/cards/tag-card"


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
        <main className=" max-w-[720px] mx-auto gap-4 flex flex-col">
            <Header />
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
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {isLoading && <p>Loading tags...</p>}
                {error && <p>Error loading tags</p>}
                {data &&
                    data?.tags?.map((tag: string, index: number) => (
                        <div key={index}>
                            <TagCard tag={tag} language={language} />
                        </div>
                    ))
                }
            </div>
        </main>
    )
}

export default Homepage