import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export function AlertDialogPopUp() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className=" border bg-background/70 uppercase text-gray-400 hover:text-white hover:bg-background py-6 px-5  rounded-xl">
          Skontaktuj Się z Nami
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-10 rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            W jaki sposob chcesz się skontaktować z nami?
            <h3 className=" text-sm text-neutral-400">Wybierz jedną z ponizszych opcji:</h3>
          </AlertDialogTitle>
          <AlertDialogDescription className=" flex gap-5 flex-col ">test</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="border-2 border-primary bg-transparent">
            Zamknij
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDialogPopUp
