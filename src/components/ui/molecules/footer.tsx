import { AppleIcon, PlayStoreIcon } from "@/components/icons/icons"

const Distribution = [
    {
        name: "App Store",
        icon: <AppleIcon className="w-4 h-4" />,
        href: "https://apps.apple.com/in/app/webuddhist/id6745810914",
    },
    {
        name: "Google Play",
        icon: <PlayStoreIcon className="w-4 h-4" />,
        href: "https://play.google.com/store/apps/details?id=org.pecha.app&hl=en_IN&pli=1",
    }
]

const Footer = () => {
    return (
        <footer className="w-full max-w-2xl mx-auto space-y-2 p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-400 tracking-wide text-center">
                Get daily reminders with the WeBuddhist App
            </p>

            <div className="flex flex-row items-center justify-center gap-1 sm:gap-6 w-full">
                {Distribution.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-300 text-sm tracking-wide"
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </a>
                ))}
            </div>
        </footer>
    );
};

export default Footer;