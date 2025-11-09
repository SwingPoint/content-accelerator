import { readFile } from 'fs/promises';
import { join } from 'path';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  Calendar,
  AlertCircle,
  FileText,
  Video,
  Mail,
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

async function getReviewData(slug: string) {
  try {
    const reviewPath = join(process.cwd(), 'review', slug);
    const indexData = await readFile(join(reviewPath, 'index.json'), 'utf-8');
    const index = JSON.parse(indexData);
    
    const scheduleData = await readFile(join(reviewPath, 'schedule.json'), 'utf-8');
    const schedule = JSON.parse(scheduleData);
    
    const validationData = await readFile(join(reviewPath, 'validation.json'), 'utf-8');
    const validation = JSON.parse(validationData);
    
    const blogContent = await readFile(join(reviewPath, 'blog.md'), 'utf-8');
    const videoScript = await readFile(join(reviewPath, 'video-script.md'), 'utf-8');
    const email = await readFile(join(reviewPath, 'email.md'), 'utf-8');
    const socialPosts = await readFile(join(reviewPath, 'social-posts.json'), 'utf-8');
    
    return {
      index,
      schedule,
      validation,
      content: {
        blog: blogContent,
        videoScript,
        email,
        socialPosts: JSON.parse(socialPosts),
      },
    };
  } catch (error) {
    console.error('Error loading review data:', error);
    return null;
  }
}

export default async function ReviewPage({ params }: { params: { slug: string } }) {
  const data = await getReviewData(params.slug);
  
  if (!data) {
    return (
      <div className="max-w-6xl">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
            <p className="text-gray-500">
              The content week "{params.slug}" could not be loaded.
            </p>
            <Link href="/app/projects">
              <Button className="mt-6">Back to Projects</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { index, schedule, validation, content } = data;

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{index.metadata.topic}</h1>
          <p className="text-gray-500 mt-1">
            {index.metadata.businessName} • {index.metadata.region}
          </p>
          <div className="flex items-center space-x-4 mt-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              index.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
              index.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700' :
              index.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {index.status}
            </span>
            <span className="text-sm text-gray-500">
              Created {new Date(index.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Request Changes</Button>
          <Button>Approve Content</Button>
        </div>
      </div>

      {/* Validation Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Quality Score</CardTitle>
              <CardDescription>
                SEO + AIO + GEO optimization validation
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {validation.overallScore}
                </div>
                <div className="text-sm text-gray-500">out of 100</div>
              </div>
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {validation.summary.passes}
              </div>
              <div className="text-sm text-gray-600">Passes</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {validation.summary.warnings}
              </div>
              <div className="text-sm text-gray-600">Warnings</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {validation.summary.failures}
              </div>
              <div className="text-sm text-gray-600">Failures</div>
            </div>
          </div>
          
          <details className="cursor-pointer">
            <summary className="font-medium text-sm text-purple-600 hover:text-purple-700">
              View detailed validation results
            </summary>
            <div className="mt-4 space-y-2">
              {validation.results.map((result: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {result.status === 'pass' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {result.status === 'warn' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                    {result.status === 'fail' && <AlertCircle className="h-4 w-4 text-red-500" />}
                    <div>
                      <div className="text-sm font-medium">{result.item}</div>
                      <div className="text-xs text-gray-500">{result.category}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{result.message}</div>
                </div>
              ))}
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Content Assets */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Blog */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Blog Article
            </CardTitle>
            <CardDescription>
              {index.assets.blog.wordCount} words • SEO optimized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-500">Title</div>
                <div className="text-sm mt-1">{index.assets.blog.title}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Meta Description</div>
                <div className="text-sm mt-1">{index.assets.blog.metaDescription}</div>
              </div>
              <Link href={`/blog/${params.slug}`} target="_blank">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Preview Blog
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Video */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5" />
              Video Scripts
            </CardTitle>
            <CardDescription>
              Main video + {index.assets.videoScript.shortsCount} shorts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-500">Main Video</div>
                <div className="text-sm mt-1">
                  {index.assets.videoScript.mainVideoDuration} duration
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Shorts</div>
                <div className="text-sm mt-1">
                  5 vertical videos (30-60s each)
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                View Scripts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Social Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Social Media Posts
            </CardTitle>
            <CardDescription>
              {(Object.values(index.assets.socialPosts.platforms) as number[]).reduce((a, b) => a + b, 0)} posts across {Object.keys(index.assets.socialPosts.platforms).length} platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(Object.entries(index.assets.socialPosts.platforms) as [string, number][]).map(([platform, count]) => (
                <div key={platform} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{platform}</span>
                  <span className="text-gray-500">{count} posts</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2">
                View All Posts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Email Newsletter
            </CardTitle>
            <CardDescription>
              {index.assets.email.subjectLines} subject line options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-500">Format</div>
                <div className="text-sm mt-1">HTML-ready Markdown</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">CTA</div>
                <div className="text-sm mt-1">Free assessment booking</div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                Preview Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Publishing Schedule
          </CardTitle>
          <CardDescription>
            {schedule.items.length} posts scheduled • Timezone: {schedule.timezone}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {schedule.items.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium capitalize">
                      {item.platform} - {item.postType}
                    </div>
                    <div className="text-xs text-gray-500">{item.displayTime}</div>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="mr-2 h-5 w-5" />
            Generated Images
          </CardTitle>
          <CardDescription>
            Platform-optimized images with alt text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {index.metadata.platforms.map((platform: string) => (
              <div key={platform} className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-xs font-medium capitalize">{platform}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Images generated with Node, resized with Sharp for each platform
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Link href="/app/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
        <div className="flex space-x-3">
          <Button variant="outline">Export All</Button>
          <Button variant="outline">Schedule Posts</Button>
          <Button>Mark as Approved</Button>
        </div>
      </div>
    </div>
  );
}

