import { type PaliScript } from "pali_script_convertor"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/atom/select"
import { SCRIPT_LABELS } from "@/lib/constant"

interface PaliScriptDropdownProps {
    value: PaliScript
    onChange: (next: PaliScript) => void
}

export function PaliScriptDropdown({ value, onChange }: PaliScriptDropdownProps) {
    return (
        <Select value={value} onValueChange={(v) => onChange(v as PaliScript)}>
            <SelectTrigger className="min-w-32 ">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(SCRIPT_LABELS).map(([script, label]) => (
                    <SelectItem key={script} value={script}>
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
