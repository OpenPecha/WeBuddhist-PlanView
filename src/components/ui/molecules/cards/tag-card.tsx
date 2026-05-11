import { Card, CardHeader, CardTitle } from '../../atom/card'
import tagimage from "@/assets/images/1.png"
import { useNavigate } from 'react-router-dom'

const TagCard = ({ tag, language }: { tag: string, language: string }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/plans?language=${language}&tag=${encodeURIComponent(tag)}`)
    }

    return (
        <Card
            className='max-w-sm p-0 rounded-sm cursor-pointer transition-shadow'
            onClick={handleClick}
        >
            <CardHeader className='p-0'>
                <img
                    className="h-44 w-full object-cover object-[center_5%]"
                    src={tagimage}
                    alt={tag}
                />
                <CardTitle className={`p-4 text-center ${language === 'bo' ? 'tibetan-font' : ''}`}>{tag}</CardTitle>
            </CardHeader>
        </Card>
    )
}

export default TagCard