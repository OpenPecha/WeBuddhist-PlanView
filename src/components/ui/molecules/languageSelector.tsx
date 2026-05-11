import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../atom/select'

const languageSelector = () => {
    return (
        <Select>
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
    )
}

export default languageSelector