'use client';

import { Button } from '@/components/ui/button';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { MatchResultDialogTopNav } from './MatchResultDialogTopNav';
import { MatchResultContent } from './MatchResultContent';
import { MatchResultDialogFooter } from './MatchResultDialogFooter';

export function MatchResultDialog() {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/85 backdrop-blur-md duration-300 ease-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            transition
            className="max-w-2xl w-full h-full space-y-4 p-12 flex flex-col items-center justify-between duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <MatchResultDialogTopNav />
            <MatchResultContent />
            <MatchResultDialogFooter />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
