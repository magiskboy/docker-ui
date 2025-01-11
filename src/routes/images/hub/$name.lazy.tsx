import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/images/hub/$name')({
  component: RouteComponent,
})

function RouteComponent() {
  return <iframe src="https://hub.docker.com/_/$name" style={{width: '100%', height: '100%'}}></iframe>
}
