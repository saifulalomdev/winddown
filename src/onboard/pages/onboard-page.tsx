import { Button } from '@/components/ui/button'
import { AuthBranding } from '@/features/auth'
import { Link } from 'react-router-dom'

export  function OnboardPage() {
    return (
        <main className="flex flex-col justify-between h-dvh py-10 px-6">
            <AuthBranding/>
            <div className="space-y-3 w-full">
                 <Button variant="secondary" className="w-full gap-3">
                    Join to a route
                </Button>
               <Link to="/orgs/new">
                <Button className="w-full gap-3">
                    Setup route
                </Button>
               </Link>
            </div>
        </main>
    )
}
