import { Outlet } from 'react-router-dom'

export default function BaseLayout() {
  return (
    <main className='overflow-hidden h-dvh'>
        <Outlet/>
    </main>
  )
}
