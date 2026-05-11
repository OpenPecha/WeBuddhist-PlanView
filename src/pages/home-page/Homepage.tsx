import logo from "@/assets/icon/pecha-icon.png"
import { Separator } from "@/components/ui/separator"
import api from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/atom/select'
import { useMutation } from '@tanstack/react-query'


export const fetchTag = async (language: string) => {
    const { data } = await api.get("/api/v1/plans/tags", {
        params: {
            language: language,
        }
    })
    return data
}

const Homepage = () => {
    const mutation = useMutation({
        mutationFn: fetchTag,
        onSuccess: (data) => {
            console.log('Tags fetched successfully:', data)
        },
        onError: (error) => {
            console.error('Error fetching tags:', error)
        }
    })

    const handleLanguageChange = (language: string) => {
        mutation.mutate(language)
    }

    return (
        <main className="w-full bg-[#FAFAFA]">
            <div className="flex items-center gap-2 px-4 py-2">
                <img src={logo} alt="logo" className="w-10 h-10" />
                <p className="text-sm font-medium text-[#3D3D3A]">WeBuddhist </p>
                <Separator orientation="vertical" />
                <p className="text-sm text-[#3D3D3A]">Plan Viewer</p>
            </div>
            <Select onValueChange={handleLanguageChange}>
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
        </main>
    )
}

export default Homepage
