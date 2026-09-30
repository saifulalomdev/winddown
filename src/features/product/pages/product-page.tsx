import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { PlusIcon, ShoppingBag } from 'lucide-react'
import { Input } from '@/components/ui/input';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

export default function ProductPage() {
    return (
        <>
            <Header className='flex flex-col gap-3'>
                <div className='flex justify-between items-center'>
                    <h1 className="text-xl font-bold tracking-tight">
                        Products
                    </h1>
                    <div className='flex gap-3 items-center'>
                        <Drawer>
                            <DrawerTrigger>
                                <Button variant="outline" size="icon" className="shrink-0 sm:hidden">
                                    <PlusIcon size={30} />
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader>
                                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                                </DrawerHeader>
                                <div className='overflow-y-auto'>
                                    lorem2000
                                </div>
                                <DrawerFooter>
                                    <Button >Submit</Button>
                                    <DrawerClose>
                                        <Button className='w-full' variant="outline">Cancel</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>

                        </Drawer>
                        <Button variant="outline" size="icon" className="shrink-0 sm:hidden">
                            <ShoppingBag size={30} />
                        </Button>
                    </div>
                </div>
            </Header>
            <div>
                <Input placeholder='Search products' />
            </div>
        </>
    )
}
