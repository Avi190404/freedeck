import Link from "next/link"
import { FileQuestion } from "lucide-react" // Icon for missing file
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
      
      {/* Icon Area */}
      <div className="bg-muted p-4 rounded-full">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>

      {/* Text Area */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Page Not Found</h2>
        <p className="text-muted-foreground max-w-[400px]">
          We couldn't find the board or page you were looking for. It might have been deleted or you may not have permission to view it.
        </p>
      </div>

      {/* Action Button */}
      <Button asChild>
        <Link href="/">
          Return to Dashboard
        </Link>
      </Button>
    </div>
  )
}