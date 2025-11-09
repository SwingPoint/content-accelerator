'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Link as LinkIcon } from 'lucide-react';

export default function IntakePage() {
  const [seedUrls, setSeedUrls] = useState('');
  const [businessName, setBusinessName] = useState('Bay Area HVAC Pro');
  const [region, setRegion] = useState('San Francisco, CA');
  const [topic, setTopic] = useState('AI-Powered Predictive Maintenance');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation
    setTimeout(() => {
      window.location.href = '/app/review/week-01-ai-hvac-maintenance';
    }, 2000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">New Content Week</h1>
        <p className="text-gray-500 mt-1">
          Generate SEO + AIO + GEO-optimized weekly content
        </p>
      </div>

      {/* Seed Content Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LinkIcon className="mr-2 h-5 w-5" />
            Seed Content (Optional)
          </CardTitle>
          <CardDescription>
            Base this week's content on existing articles, blogs, or videos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="seed-urls">Source URLs (one per line)</Label>
            <textarea
              id="seed-urls"
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="https://example.com/article-1&#10;https://example.com/article-2"
              value={seedUrls}
              onChange={(e) => setSeedUrls(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="angle">Angle</Label>
            <Input
              id="angle"
              placeholder="e.g., localize, myth-bust, checklist, buyer's guide"
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Details */}
      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>
            Information about your business for content personalization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div>
            <Label htmlFor="value-prop">Value Proposition</Label>
            <Input
              id="value-prop"
              placeholder="What makes your business unique?"
            />
          </div>
          <div>
            <Label htmlFor="brand-voice">Brand Voice</Label>
            <Input
              id="brand-voice"
              placeholder="e.g., professional, friendly, technical"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Focus */}
      <Card>
        <CardHeader>
          <CardTitle>Content Focus</CardTitle>
          <CardDescription>
            What should this week's content be about?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic + Angle</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Main topic for this week"
            />
          </div>
          <div>
            <Label htmlFor="takeaways">Key Takeaways (comma separated)</Label>
            <Input
              id="takeaways"
              placeholder="Reduce downtime, Save costs, Improve efficiency"
            />
          </div>
          <div>
            <Label htmlFor="keywords">Keywords/Hashtags</Label>
            <Input
              id="keywords"
              placeholder="HVAC, AI, predictive maintenance"
            />
          </div>
          <div>
            <Label htmlFor="offer-url">Offer URL (CTA destination)</Label>
            <Input
              id="offer-url"
              type="url"
              placeholder="https://yoursite.com/contact"
            />
          </div>
        </CardContent>
      </Card>

      {/* Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution</CardTitle>
          <CardDescription>
            Select platforms for this week's content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {['Facebook', 'Instagram', 'LinkedIn', 'Google Business Profile', 'TikTok', 'YouTube', 'Email'].map(
              platform => (
                <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={platform !== 'TikTok'}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{platform}</span>
                </label>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Week Identifier */}
      <Card>
        <CardHeader>
          <CardTitle>Week Identifier</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="slug">Slug (URL-friendly)</Label>
            <Input
              id="slug"
              defaultValue="week-01-ai-hvac-maintenance"
              placeholder="week-01-topic-name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Save Draft</Button>
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="min-w-[150px]"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin mr-2">⚙️</span>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

