import logo from "@/assets/icon/pecha-icon.png"
import { Separator } from "@/components/ui/atom/separator"

const Header = () => {
    return (
        <div className="flex items-center gap-2 px-4 py-2">
            <img src={logo} alt="logo" className="w-10 h-10" />
            <p className="text-sm font-medium text-[#3D3D3A]">WeBuddhist</p>
            <Separator orientation="vertical" />
            <p className="text-sm text-[#3D3D3A]">Plan Viewer</p>
        </div>
    )
}

export default Header
