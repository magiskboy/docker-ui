import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/volumes')({
  component: () => <div>Hello /volumes!</div>,
})
