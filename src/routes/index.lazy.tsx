import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Home,
})

export function Home() {
  return (
    <>
      Hello world
    </>
  )
}


