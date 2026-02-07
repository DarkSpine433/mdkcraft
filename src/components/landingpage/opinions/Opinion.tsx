import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Props = {
  opinionText: string
  name: string
  lastName: string
  stars?: number
  starHalf?: boolean
  imgSrc: string
}

const Opinion = ({ name, lastName, imgSrc, opinionText, stars, starHalf }: Props) => {
  const roundeStars = typeof stars !== 'number' ? 0 : Math.floor(stars)
  const EmptyStars = 5 - (typeof roundeStars !== 'number' ? 0 : roundeStars) - (starHalf ? 1 : 0)

  return (
    <Card className="border-y-primary border-x-0 w-fit flex flex-col bg-transparent ">
      <CardHeader>
        <CardTitle>
          <Avatar>
            <AvatarImage src={imgSrc} alt="Avatar Image" />
            <AvatarFallback>
              {name}&nbsp;{lastName}
            </AvatarFallback>
          </Avatar>
        </CardTitle>
        <CardDescription>
          {name}&nbsp;{lastName}
        </CardDescription>
      </CardHeader>
      <CardContent className=" flex flex-row self-center">
        {/* {roundeStars < 0 ||
          roundeStars > 5 ||
          typeof stars !== "number" ||
          [...Array(roundeStars)].map((_, i) => (
            <FaStar key={i} className="text-primary" />
          ))}
        {starHalf && roundeStars < 5 && (
          <FaStarHalfAlt className="text-primary" />
        )}
        {EmptyStars > 0 &&
          [...Array(EmptyStars)].map((_, i) => (
            <FaRegStar key={i} className="text-primary" />
          ))} Gemini fix star rating */}
      </CardContent>
      <CardFooter className="px-10 min-h-56">{opinionText}</CardFooter>
    </Card>
  )
}

export default Opinion
