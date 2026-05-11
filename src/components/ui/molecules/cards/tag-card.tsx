import { Card, CardHeader, CardTitle } from '../../atom/card'

const TagCard = ({ tag }: { tag: string }) => {
    return (

        <Card className=' max-w-sm'>
            <CardHeader>
                <CardTitle>{tag}</CardTitle>
            </CardHeader>
        </Card>


    )
}

export default TagCard