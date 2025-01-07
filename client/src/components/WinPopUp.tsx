import {Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react'

interface WinPopUpProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export function WinPopUp({isOpen, setIsOpen}: WinPopUpProps) {
    return <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 border bg-white p-12" style={{ color: 'black'}}>
                <DialogTitle className="font-bold">YIPE!!!!</DialogTitle>
                <Description>You have completed a bingo!!</Description>
                <div className="flex gap-4">
                    <button style={{ border: '1px solid'}} onClick={() => setIsOpen(false)}>Fuck yea, let me see my new card!</button>
                </div>
            </DialogPanel>
        </div>
    </Dialog>
}