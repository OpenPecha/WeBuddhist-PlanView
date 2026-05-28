import logo from "@/assets/icon/logo.png"
import { Separator } from "@/components/ui/atom/separator"
import LanguageSwitcher from "@/components/ui/molecules/LanguageSwitcher"
import { useTranslation } from "react-i18next"

const Header = () => {
    const { t } = useTranslation()

    return (
        <div className="flex items-center justify-between gap-2 px-4 py-2">
            <div className="flex items-center gap-2 min-w-0">
                <img src={logo} alt="logo" className="w-10 h-10 shrink-0" />
                <p className="text-sm font-medium text-[#3D3D3A]">WeBuddhist</p>
                <Separator orientation="vertical" />
                <p className="text-sm text-[#3D3D3A]">{t("header.planViewer")}</p>
            </div>
            <LanguageSwitcher className="w-fit shrink-0" />
        </div>
    )
}

export default Header
