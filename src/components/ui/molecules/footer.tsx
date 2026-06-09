import { useGroupDetails, useSeriesDetails } from "@/client_details/hooks";
import { getSeriesGroupId } from '@/lib/series-utils'
import { AppleIcon, PlayStoreIcon } from "@/components/icons/icons"
import { useParams } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation()
    const { seriesId } = useParams<{ seriesId?: string }>()
    const { data: series } = useSeriesDetails(seriesId)
    const { data: groupData } = useGroupDetails(getSeriesGroupId(series))
    const signUpUrl = groupData?.social_links?.find((link) => link.platform === "SignIn")?.url

    const distribution = [
        {
            name: t("footer.googlePlay"),
            description: t("footer.getItOn"),
            icon: <PlayStoreIcon className="w-8 h-8" />,
            href: "https://play.google.com/store/apps/details?id=org.pecha.app&hl=en_IN&pli=1",
        },
        {
            name: t("footer.appStore"),
            description: t("footer.downloadOnThe"),
            icon: <AppleIcon className="w-8 h-8" />,
            href: "https://apps.apple.com/in/app/webuddhist/id6745810914",
        },
    ]

    return (
        <footer id="we_footer" className="w-max mx-auto max-w-2xl  space-y-2  flex flex-col sm:items-center sm:justify-center mb-10">
            {/* <LanguageSwitcher className="w-fit" /> */}
            {signUpUrl && (
                <a href={signUpUrl} target="_blank" rel="noopener noreferrer" className=" text-center mt-10 sm:mt-0 md:h-[40px] text-white px-4 py-2 tracking-wide w-full h-[40px] mb-10 sm:mb-20 sm:w-max mx-auto md:text-xl  bg-[#f66e00] font-[lato] hover:bg-[#f66e00]/80">
                    {t("footer.registerEvent")}
                </a>
            )}
            <p className="text-md text-gray-400 tracking-wide ">
                <Trans
                    i18nKey="footer.dailyReminders"
                    components={{ bold: <span className="font-bold" /> }}
                />
            </p>


            <div className="flex flex-row flex-wrap pb-20 gap-2 sm:gap-2 w-full sm:items-center sm:justify-center">
                {distribution.map((item) => (
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
