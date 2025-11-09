import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Mail } from 'lucide-react';

export default async function MembersPage() {
  const session = await auth();
  
  // Get user's workspaces and memberships
  const memberships = await prisma.membership.findMany({
    where: { userId: session!.user!.id },
    include: {
      workspace: {
        include: {
          memberships: {
            include: {
              user: true,
            },
          },
          invitations: {
            where: {
              expiresAt: { gt: new Date() },
              acceptedAt: null,
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-gray-500 mt-1">
            Manage workspace members and invitations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="grid gap-6">
        {memberships.map(({ workspace, role }) => (
          <Card key={workspace.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{workspace.name}</CardTitle>
                  <CardDescription>
                    {workspace.memberships.length} members
                  </CardDescription>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                  Your role: {role}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-3">Active Members</h4>
                  <div className="space-y-2">
                    {workspace.memberships.map(member => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-600 font-semibold">
                              {member.user.name?.charAt(0) || member.user.email.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {member.user.name || member.user.email}
                            </p>
                            <p className="text-sm text-gray-500">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            member.role === 'OWNER' ? 'bg-purple-100 text-purple-700' :
                            member.role === 'STAFF' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {member.role}
                          </span>
                          {role === 'OWNER' && member.role !== 'OWNER' && (
                            <Button variant="ghost" size="sm">
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {workspace.invitations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Pending Invitations</h4>
                    <div className="space-y-2">
                      {workspace.invitations.map(invitation => (
                        <div
                          key={invitation.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-dashed"
                        >
                          <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">{invitation.email}</p>
                              <p className="text-sm text-gray-500">
                                Invited as {invitation.role}
                              </p>
                            </div>
                          </div>
                          {role === 'OWNER' && (
                            <Button variant="ghost" size="sm">
                              Revoke
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

