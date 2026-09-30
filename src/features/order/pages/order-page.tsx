import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Input } from '@/components/ui/input'
import { FilterIcon } from 'lucide-react'

export function OrderPage() {
    return (
        <>
            <Header className='flex flex-col gap-3'>
                <div className='flex justify-between items-center'>
                    <h1 className="text-xl font-bold tracking-tight">
                        Orders
                    </h1>
                    {/* Consistent icon button action */}
                    <Button variant="outline" size="icon" className="shrink-0 sm:hidden">
                        <FilterIcon className="h-5 w-5" />
                    </Button>
                </div>
            </Header>
            <div>
                <Input placeholder='Search orders...' />
            </div>
        </>
    )
}