import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

export default async function SettingsPage() {
  const session = await auth();
  
  // Get user's workspaces with owner role
  const ownedWorkspaces = await prisma.membership.findMany({
    where: { 
      userId: session!.user!.id,
      role: 'OWNER'
    },
    include: {
      workspace: {
        include: {
          settings: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage platform connections and workspace settings
        </p>
      </div>

      {ownedWorkspaces.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              You must be a workspace owner to manage settings
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {ownedWorkspaces.map(({ workspace }) => (
            <Card key={workspace.id}>
              <CardHeader>
                <CardTitle>{workspace.name}</CardTitle>
                <CardDescription>
                  Platform connections for this workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Facebook */}
                <PlatformConnection
                  name="Facebook"
                  connected={!!workspace.settings?.facebookToken}
                  description="Connect your Facebook Page for posting"
                />

                {/* Instagram */}
                <PlatformConnection
                  name="Instagram"
                  connected={!!workspace.settings?.instagramToken}
                  description="Connect Instagram Business Account"
                />

                {/* LinkedIn */}
                <PlatformConnection
                  name="LinkedIn"
                  connected={!!workspace.settings?.linkedinToken}
                  description="Connect LinkedIn Company Page"
                />

                {/* Google Business Profile */}
                <PlatformConnection
                  name="Google Business Profile"
                  connected={!!workspace.settings?.gbpToken}
                  description="Connect your Google Business Profile"
                />

                {/* TikTok */}
                <PlatformConnection
                  name="TikTok"
                  connected={!!workspace.settings?.tiktokToken}
                  description="Connect TikTok Business Account"
                />

                {/* YouTube */}
                <PlatformConnection
                  name="YouTube"
                  connected={!!workspace.settings?.youtubeToken}
                  description="Connect YouTube Channel"
                />

                {/* Email Provider */}
                <div className="pt-6 border-t">
                  <h4 className="font-semibold mb-4">Email Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email-provider">Email Provider</Label>
                      <Input
                        id="email-provider"
                        placeholder="SendGrid, Mailchimp, etc."
                        defaultValue={workspace.settings?.emailProvider || ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-token">API Token</Label>
                      <Input
                        id="email-token"
                        type="password"
                        placeholder="Enter API token (encrypted)"
                      />
                    </div>
                    <Button size="sm">Save Email Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PlatformConnection({ 
  name, 
  connected, 
  description 
}: { 
  name: string; 
  connected: boolean; 
  description: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div className="flex items-center space-x-4">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
          connected ? 'bg-green-100' : 'bg-gray-100'
        }`}>
          {connected ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <XCircle className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <Button variant={connected ? "outline" : "default"} size="sm">
        {connected ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  );
}

