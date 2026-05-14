import { AppleIcon, PlayStoreIcon } from "@/components/icons/icons"

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

const Footer = () => {
    return (
        <footer id="we_footer" className="w-max sm:mx-auto max-w-2xl  space-y-2 p-4 flex flex-col sm:items-center sm:justify-center">
            <p className="text-sm text-gray-400 tracking-wide ">
                Get daily reminders with the WeBuddhist App
            </p>

            <div className="flex flex-col sm:flex-row  gap-2 sm:gap-6 w-full sm:items-center sm:justify-center">
                {Distribution.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-max items-center shadow-sm border border-gray-200 rounded-full gap-2.5 px-6 py-2.5 text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-300 text-sm tracking-wide"
                    >
                        {item.icon}
                        <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase">{item.description}</span>
                        <span className="text-sm font-bold">{item.name}</span>
                        </div>
                    </a>
                ))}
            </div>
        </footer>
    );
};

export default Footer;