import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Weryfikacja Konta</CardTitle>
          <CardDescription className="text-center">
            Sprawdzanie tokenu weryfikacyjnego
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 pt-6">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          <p className="text-center text-lg font-medium">Weryfikacja w toku...</p>
        </CardContent>
      </Card>
    </div>
  )
}
