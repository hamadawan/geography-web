import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface LocationCardProps extends React.ComponentProps<typeof Card> {
  item: any;
  onClick: () => void;
}

export default function LocationCard({ className, item, onClick, ...props }: LocationCardProps) {
  return (
    <Card className={cn("cursor-pointer hover:bg-gray-50 transition-colors", className)} {...props} onClick={onClick}>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{item.name || item.code}</CardTitle>
        <CardDescription>{item.country_code || item.code}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm text-gray-500">
          {item.ic ? `IC: ${item.ic}` : item.id ? `ID: ${item.id}` : ''}
        </div>
      </CardContent>
    </Card>
  )
}
