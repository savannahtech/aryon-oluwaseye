import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '.'

export const Route = createFileRoute('/_auth_routes/recommendations/archived')({
  component: () => <Dashboard isArchived={true} />,
})
