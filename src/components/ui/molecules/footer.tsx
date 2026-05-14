import { useClientDetails } from "@/client_details/hooks";
import { AppleIcon, PlayStoreIcon } from "@/components/icons/icons"
import { Button } from "../atom/button";

const Distribution = [
    {
        name: "Google Play",
        description: "Get it on",
        icon: <PlayStoreIcon className="w-8 h-8" />,
        href: "https://play.google.com/store/apps/details?id=org.pecha.app&hl=en_IN&pli=1",
    },
    {
        name: "App Store",
        description: "Download on the",
        icon: <AppleIcon className="w-8 h-8" />,
        href: "https://apps.apple.com/in/app/webuddhist/id6745810914",
    }
]
const gif_link = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXJyeHFtbWsyeWhuOWpvNmZocTJxb3Nkc3VvYzBwOXQyMDRkN2l4ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BTR0w5qkwakJBTXCcm/giphy.gif"
const Footer = () => {
    const {data}=useClientDetails()
    return (
        <footer id="we_footer" className="w-max sm:mx-auto max-w-2xl  space-y-2  flex flex-col sm:items-center sm:justify-center">
            {data?.sign_up && (
                <a href={data.sign_up} target="_blank" rel="noopener noreferrer" className="w-[177px] h-[40px] mb-20 sm:w-max sm:mx-auto">
                    <div className="w-full h-full text-xl  bg-[#f66e00] font-[lato] hover:bg-[#f66e00]/80 flex items-center justify-center gap-2.5 px-6 py-2.5 text-white tracking-wide">
                        Register for the Event in Bodhgaya </div>
                </a>
            )}
            <p className="text-md text-gray-400 tracking-wide ">
                Get daily reminders with the <span className="font-bold">WeBuddhist App</span>
            </p>

            <div className="flex flex-col sm:flex-row pb-20 gap-2 sm:gap-2 w-full sm:items-center sm:justify-center">
                {Distribution.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-max items-center border border-gray-300  rounded-full gap-2.5 px-4 py-1 text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-300 text-sm tracking-wide"
                    >
                        {item.icon}
                        <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase">{item.description}</span>
                        <span className="text-sm ">{item.name}</span>
                        </div>
                    </a>
                ))}
            </div>
        </footer>
    );
};

export default Footer;