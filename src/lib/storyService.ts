import { supabase } from "@/integrations/supabase/client";

export interface Story {
  id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  media_type: "image" | "video" | null;
  story_type: "text" | "image" | "video";
  background_color: string;
  duration: number;
  views_count: number;
  created_at: string;
  expires_at: string;
}

export interface StoryGroup {
  user_id: string;
  username: string;
  name: string;
  avatar_url: string | null;
  stories: Story[];
  hasUnviewed: boolean;
}

export interface StoryViewerInfo {
  viewer_id: string;
  username: string;
  name: string;
  avatar_url: string | null;
  viewed_at: string;
}

export async function getActiveStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from("user_stories")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching stories:", error);
    return [];
  }
  return (data || []).map(normalizeStory);
}

function normalizeStory(raw: Record<string, unknown>): Story {
  const storyType = (raw.story_type as string) || "text";
  let mediaType: "image" | "video" | null = null;
  if (storyType === "image") mediaType = "image";
  else if (storyType === "video") mediaType = "video";
  else if (raw.media_url) {
    const url = (raw.media_url as string).toLowerCase();
    mediaType = url.includes(".mp4") || url.includes(".webm") || url.includes(".mov") || url.includes("video")
      ? "video" : "image";
  }

  let duration = 5;
  if (raw.duration && typeof raw.duration === "number") duration = raw.duration;
  else if (storyType === "video") duration = 15;
  else if (storyType === "image") duration = 7;

  return {
    id: raw.id as string,
    user_id: raw.user_id as string,
    content: raw.content as string | null,
    media_url: raw.media_url as string | null,
    media_type: mediaType,
    story_type: storyType as Story["story_type"],
    background_color: (raw.background_color as string) || "hsl(338, 85%, 55%)",
    duration,
    views_count: (raw.views_count as number) || 0,
    created_at: raw.created_at as string,
    expires_at: raw.expires_at as string,
  };
}

export async function createTextStory(content: string, bgColor: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("user_stories")
    .insert({
      user_id: user.id,
      content,
      story_type: "text",
      background_color: bgColor,
    });

  if (error) {
    console.error("Error creating story:", error);
    return false;
  }
  return true;
}

export async function createMediaStory(
  mediaUrl: string,
  mediaType: "image" | "video",
  caption?: string,
  duration?: number
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("user_stories")
    .insert({
      user_id: user.id,
      media_url: mediaUrl,
      content: caption || null,
      story_type: mediaType,
    });

  if (error) {
    console.error("Error creating media story:", error);
    return false;
  }
  return true;
}

export async function createImageStory(mediaUrl: string, caption?: string): Promise<boolean> {
  return createMediaStory(mediaUrl, "image", caption);
}

export async function viewStory(storyId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("story_views")
    .upsert({ story_id: storyId, viewer_id: user.id }, { onConflict: "story_id,viewer_id" });
}

export async function getMyViewedStories(): Promise<Set<string>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("story_views")
    .select("story_id")
    .eq("viewer_id", user.id);

  return new Set((data || []).map((v) => v.story_id));
}

export async function getStoryViewers(storyId: string): Promise<StoryViewerInfo[]> {
  const { data, error } = await supabase
    .from("story_views")
    .select("viewer_id, story_id")
    .eq("story_id", storyId);

  if (error || !data || data.length === 0) return [];

  const viewerIds = data.map(v => v.viewer_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, name, avatar_url")
    .in("id", viewerIds);

  const profileMap = new Map<string, { username: string; name: string; avatar_url: string | null }>();
  for (const p of profiles || []) {
    profileMap.set(p.id, { username: p.username, name: p.name || p.username, avatar_url: p.avatar_url });
  }

  return data.map(v => {
    const p = profileMap.get(v.viewer_id);
    return {
      viewer_id: v.viewer_id,
      username: p?.username || "user",
      name: p?.name || p?.username || "User",
      avatar_url: p?.avatar_url || null,
      viewed_at: "",
    };
  });
}

export async function deleteStory(storyId: string): Promise<boolean> {
  const { error } = await supabase
    .from("user_stories")
    .delete()
    .eq("id", storyId);

  if (error) {
    console.error("Error deleting story:", error);
    return false;
  }
  return true;
}

export async function uploadStoryMedia(file: File): Promise<{ url: string; type: "image" | "video" }> {
  const isVideo = file.type.startsWith("video/");
  const ext = file.name.split(".").pop() || (isVideo ? "mp4" : "jpg");
  const fileName = `story-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `stories/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("chat-media")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("[StoryUpload] Upload error:", uploadError);
    throw uploadError;
  }

  const uploadPath = uploadData?.path || path;

  const { data: urlData, error: urlError } = await supabase.storage
    .from("chat-media")
    .createSignedUrl(uploadPath, 86400);

  if (urlError) {
    console.error("[StoryUpload] Signed URL error:", urlError);
  }

  if (urlData?.signedUrl) {
    return { url: urlData.signedUrl, type: isVideo ? "video" : "image" };
  }

  const { data: publicUrlData } = supabase.storage
    .from("chat-media")
    .getPublicUrl(uploadPath);

  if (publicUrlData?.publicUrl) {
    return { url: publicUrlData.publicUrl, type: isVideo ? "video" : "image" };
  }

  throw new Error("Failed to get media URL after upload");
}
