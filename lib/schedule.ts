/**
 * lib/schedule.ts
 * Content scheduling with timezone support
 */

export type PlatformSchedule = {
  platform: string;
  postType: string; // "post", "story", "reel", "video", "email"
  scheduledFor: string; // ISO 8601 datetime
  status: 'pending' | 'posted' | 'failed';
};

export type WeekSchedule = {
  timezone: string;
  items: PlatformSchedule[];
};

/**
 * Best posting times by platform (general guidelines)
 */
const BEST_TIMES = {
  facebook: [
    { day: 1, hour: 9 },  // Monday 9 AM
    { day: 3, hour: 13 }, // Wednesday 1 PM
    { day: 5, hour: 11 }, // Friday 11 AM
  ],
  instagram: [
    { day: 2, hour: 11 }, // Tuesday 11 AM
    { day: 4, hour: 14 }, // Thursday 2 PM
    { day: 5, hour: 10 }, // Friday 10 AM
  ],
  linkedin: [
    { day: 2, hour: 8 },  // Tuesday 8 AM
    { day: 3, hour: 10 }, // Wednesday 10 AM
    { day: 4, hour: 9 },  // Thursday 9 AM
  ],
  twitter: [
    { day: 1, hour: 12 }, // Monday 12 PM
    { day: 3, hour: 15 }, // Wednesday 3 PM
    { day: 5, hour: 14 }, // Friday 2 PM
  ],
  tiktok: [
    { day: 2, hour: 19 }, // Tuesday 7 PM
    { day: 4, hour: 18 }, // Thursday 6 PM
    { day: 5, hour: 17 }, // Friday 5 PM
  ],
  youtube: [
    { day: 2, hour: 14 }, // Tuesday 2 PM
    { day: 4, hour: 15 }, // Thursday 3 PM
    { day: 6, hour: 10 }, // Saturday 10 AM
  ],
  gbp: [
    { day: 1, hour: 10 }, // Monday 10 AM
    { day: 3, hour: 12 }, // Wednesday 12 PM
    { day: 5, hour: 11 }, // Friday 11 AM
  ],
  email: [
    { day: 2, hour: 10 }, // Tuesday 10 AM
  ],
};

/**
 * Get next weekday date
 * @param startDate Starting date
 * @param targetDay Day of week (0=Sunday, 1=Monday, etc.)
 * @param hour Hour (0-23)
 * @param timezone IANA timezone
 */
export function getNextWeekday(
  startDate: Date,
  targetDay: number,
  hour: number,
  timezone: string
): Date {
  const date = new Date(startDate);
  const currentDay = date.getDay();
  
  // Calculate days until target day
  let daysUntil = targetDay - currentDay;
  if (daysUntil <= 0) {
    daysUntil += 7;
  }
  
  date.setDate(date.getDate() + daysUntil);
  date.setHours(hour, 0, 0, 0);
  
  return date;
}

/**
 * Generate schedule for a platform
 */
export function schedulePlatform(
  platform: string,
  startDate: Date,
  timezone: string,
  postTypes: string[] = ['post']
): PlatformSchedule[] {
  const times = BEST_TIMES[platform as keyof typeof BEST_TIMES] || BEST_TIMES.facebook;
  const schedule: PlatformSchedule[] = [];
  
  times.forEach((time, index) => {
    const scheduledDate = getNextWeekday(startDate, time.day, time.hour, timezone);
    const postType = postTypes[index] || postTypes[0];
    
    schedule.push({
      platform,
      postType,
      scheduledFor: scheduledDate.toISOString(),
      status: 'pending',
    });
  });
  
  return schedule;
}

/**
 * Generate full week schedule
 */
export function generateWeekSchedule(
  platforms: string[],
  startDate: Date,
  timezone: string = 'America/Los_Angeles'
): WeekSchedule {
  const items: PlatformSchedule[] = [];
  
  platforms.forEach(platform => {
    const platformNormalized = platform.toLowerCase();
    
    // Define post types per platform
    const postTypes: Record<string, string[]> = {
      facebook: ['post', 'post', 'post'],
      instagram: ['post', 'reel', 'story'],
      linkedin: ['post', 'post', 'article'],
      twitter: ['post', 'post', 'thread'],
      tiktok: ['video', 'video', 'video'],
      youtube: ['video', 'short', 'short'],
      gbp: ['post', 'post', 'update'],
      email: ['newsletter'],
    };
    
    const types = postTypes[platformNormalized] || ['post'];
    const platformSchedule = schedulePlatform(platformNormalized, startDate, timezone, types);
    items.push(...platformSchedule);
  });
  
  // Sort by scheduled time
  items.sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
  
  return {
    timezone,
    items,
  };
}

/**
 * Format schedule for display
 */
export function formatScheduleDate(isoDate: string, timezone: string): string {
  const date = new Date(isoDate);
  
  // Format: "Monday, Nov 11 at 9:00 AM PST"
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
    timeZoneName: 'short',
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Check if schedule time is in the past
 */
export function isScheduleExpired(isoDate: string): boolean {
  return new Date(isoDate) < new Date();
}

/**
 * Get days until scheduled post
 */
export function getDaysUntil(isoDate: string): number {
  const now = new Date();
  const scheduled = new Date(isoDate);
  const diff = scheduled.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

