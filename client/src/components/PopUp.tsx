import {Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react'
import {JSX} from "react";

interface WinPopUpProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    title: string;
    description: string;
    buttons?: ((arg: (isOpen: boolean) => void) => JSX.Element)[];
    exitText?: string;
}

const exitButton = (setIsOpen: ((isOpen: boolean) => void), exitText: string) => <button style={{border: '1px solid'}}
                                                                                         onClick={() => setIsOpen(false)}>{exitText}</button>

export function PopUp({isOpen, setIsOpen, title, description, buttons, exitText}: WinPopUpProps) {
    return <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30"/>
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 border bg-white p-12" style={{color: 'black'}}>
                <DialogTitle className="font-bold">{title}</DialogTitle>
                <Description>{description}</Description>
                <div className="flex gap-4">
                    {buttons?.map((button) => (button(setIsOpen)))}
                    {exitButton(setIsOpen, exitText ?? 'Close')}
                </div>
            </DialogPanel>
        </div>
    </Dialog>
}