import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Calendar, CheckCircle, Clock } from 'lucide-react';

export default async function ProjectsPage() {
  const session = await auth();
  
  // Get user's workspaces
  const memberships = await prisma.membership.findMany({
    where: { userId: session!.user!.id },
    include: {
      workspace: {
        include: {
          projects: {
            include: {
              contentWeeks: {
                orderBy: { createdAt: 'desc' },
                take: 5,
              },
            },
          },
        },
      },
    },
  });

  const workspaces = memberships.map(m => ({
    ...m.workspace,
    role: m.role,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-500 mt-1">
            Manage your content projects and weekly campaigns
          </p>
        </div>
        <Link href="/app/intake">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Content Week
          </Button>
        </Link>
      </div>

      {workspaces.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <LayoutDashboard className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-gray-500 text-center mb-6 max-w-md">
              Get started by creating your first workspace and project.
            </p>
            <Button>Create Workspace</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {workspaces.map(workspace => (
            <Card key={workspace.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{workspace.name}</CardTitle>
                    <CardDescription>
                      {workspace.description || 'No description'}
                    </CardDescription>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                    {workspace.role}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {workspace.projects.length === 0 ? (
                  <p className="text-sm text-gray-500">No projects in this workspace</p>
                ) : (
                  <div className="space-y-4">
                    {workspace.projects.map(project => (
                      <div key={project.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{project.name}</h4>
                          <Link href={`/app/projects/${project.slug}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                        </div>
                        
                        {project.contentWeeks.length > 0 ? (
                          <div className="space-y-2">
                            {project.contentWeeks.map(week => (
                              <Link 
                                key={week.id} 
                                href={`/app/review/${week.slug}`}
                                className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center space-x-3">
                                  {week.status === 'DRAFT' && <Clock className="h-4 w-4 text-gray-400" />}
                                  {week.status === 'REVIEWED' && <CheckCircle className="h-4 w-4 text-blue-500" />}
                                  {week.status === 'APPROVED' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                  {week.status === 'SCHEDULED' && <Calendar className="h-4 w-4 text-purple-500" />}
                                  {week.status === 'POSTED' && <CheckCircle className="h-4 w-4 text-green-600" />}
                                  <span className="text-sm font-medium">{week.topic}</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  week.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                                  week.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700' :
                                  week.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                  week.status === 'SCHEDULED' ? 'bg-purple-100 text-purple-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {week.status}
                                </span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No content weeks yet</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function LayoutDashboard({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  );
}

