import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../atom/card'
import { useNavigate } from 'react-router-dom'
import { Calendar, User } from 'lucide-react'
import { Badge } from '../../atom/badge'

interface Plan {
    id: string
    title: string
    description: string
    language: string
    difficulty_level: string
    image: {
        thumbnail: string
        medium: string
        original: string
    }
    total_days: number
    tags: string[]
    author: {
        id: string
        firstname: string
        lastname: string
        image: string | null
    }
    start_date: string | null
}

interface PlanCardProps {
    plan: Plan
    language: string
}

const PlanCard = ({ plan, language }: PlanCardProps) => {
    const navigate = useNavigate()

    const handleClick = () => {
        const query = plan.start_date ? `?date=${encodeURIComponent(plan.start_date)}` : ''
        navigate(`/${plan.id}${query}`)
    }

    const getDifficultyColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'beginner':
                return 'bg-green-100 text-green-800 hover:bg-green-100'
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
            case 'advanced':
                return 'bg-red-100 text-red-800 hover:bg-red-100'
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        }
    }

    return (
        <Card
            className='cursor-pointer p-0 rounded-sm overflow-hidden'
            onClick={handleClick}
        >
            <CardHeader className='p-0'>
                <img
                    className="h-48 w-full hover:scale-105 transition-all duration-300 object-cover"
                    src={plan.image.original}
                    alt={plan.title}
                    loading="lazy"
                />
            </CardHeader>
            <CardContent className='p-4 space-y-3'>
                <div className='flex items-start justify-between gap-2'>
                    <CardTitle className={`text-lg line-clamp-2 ${language === 'bo' ? 'tibetan-font' : ''}`}>
                        {plan.title}
                    </CardTitle>
                    <Badge className={getDifficultyColor(plan.difficulty_level)} variant="secondary">
                        {plan.difficulty_level}
                    </Badge>
                </div>

                {plan.description && (
                    <CardDescription className={`line-clamp-2 ${language === 'bo' ? 'tibetan-font' : ''}`}>
                        {plan.description}
                    </CardDescription>
                )}

                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <div className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        <span>{plan.total_days} {plan.total_days === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <User className='h-4 w-4' />
                        <span>{plan.author.firstname} {plan.author.lastname}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default PlanCard
