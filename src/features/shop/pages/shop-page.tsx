import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { PlusIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function ShopPage() {
    return (
        <>
            <Header>
                    <h1 className="text-xl font-bold tracking-tight">
                        Shops
                    </h1>
                    <Button variant="outline" size="icon" className="shrink-0 sm:hidden">
                        <PlusIcon size={30} />
                    </Button>

            </Header>
            <div>
                <Input placeholder='Search shops' />
            </div>
        </>
    )
}
