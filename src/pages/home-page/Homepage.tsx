import LanguageSelector from "@/components/ui/molecules/languageSelector"



const Homepage = () => {
    return (
        <main className="sm:min-h-screen min-h-svh w-full flex flex-col justify-between items-center sm:p-2 p-4 bg-[#FAFAFA]">
            <LanguageSelector />
        </main>
    )
}

export default Homepage
