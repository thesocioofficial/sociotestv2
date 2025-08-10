import cron from "node-cron";
import supabase from "../config/supabaseClient.js";
import { getPathFromStorageUrl } from "../utils/fileUtils.js";

const deleteFilesFromSupabase = async (supabaseInstance, files) => {
  const filesByBucket = files.reduce((acc, file) => {
    if (!file.path) return acc;
    acc[file.bucket] = acc[file.bucket] || [];
    acc[file.bucket].push(file.path);
    return acc;
  }, {});

  for (const bucket in filesByBucket) {
    if (filesByBucket[bucket].length > 0) {
      await supabaseInstance.storage.from(bucket).remove(filesByBucket[bucket]);
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify the request is from a trusted source (you can add auth here)
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayDateString = yesterday.toISOString().split("T")[0];

    const { data: expiredFests } = await supabase
      .from("fest")
      .select("fest_id, fest_image_url")
      .eq("closing_date", yesterdayDateString);

    if (expiredFests && expiredFests.length > 0) {
      const festIds = expiredFests.map((f) => f.fest_id);
      const festImageFilesToDelete = expiredFests
        .map((f) => ({
          bucket: "fest-images",
          path: getPathFromStorageUrl(f.fest_image_url, "fest-images"),
        }))
        .filter((f) => f.path);

      const { data: associatedEvents } = await supabase
        .from("events")
        .select("event_id, event_image_url, banner_url, pdf_url")
        .in("fest", festIds);

      if (associatedEvents && associatedEvents.length > 0) {
        const eventIdsToDelete = associatedEvents.map((e) => e.event_id);
        const eventFilesToDelete = [];
        associatedEvents.forEach((e) => {
          eventFilesToDelete.push({
            bucket: "event-images",
            path: getPathFromStorageUrl(e.event_image_url, "event-images"),
          });
          eventFilesToDelete.push({
            bucket: "event-banners",
            path: getPathFromStorageUrl(e.banner_url, "event-banners"),
          });
          eventFilesToDelete.push({
            bucket: "event-pdfs",
            path: getPathFromStorageUrl(e.pdf_url, "event-pdfs"),
          });
        });

        await deleteFilesFromSupabase(
          supabase,
          eventFilesToDelete.filter((f) => f.path)
        );

        if (eventIdsToDelete.length > 0) {
          await supabase
            .from("event_registrations")
            .delete()
            .in("event_id", eventIdsToDelete);
          await supabase
            .from("events")
            .delete()
            .in("event_id", eventIdsToDelete);
        }
      }

      await deleteFilesFromSupabase(supabase, festImageFilesToDelete);
      if (festIds.length > 0) {
        await supabase.from("fest").delete().in("fest_id", festIds);
      }
      console.log(`Cleanup: Processed ${festIds.length} fests and their events.`);
    }

    const { data: standaloneEvents } = await supabase
      .from("events")
      .select("event_id, event_image_url, banner_url, pdf_url")
      .eq("end_date", yesterdayDateString)
      .is("fest", null);

    if (standaloneEvents && standaloneEvents.length > 0) {
      const eventIdsToDelete = standaloneEvents.map((e) => e.event_id);
      const eventFilesToDelete = [];
      standaloneEvents.forEach((e) => {
        eventFilesToDelete.push({
          bucket: "event-images",
          path: getPathFromStorageUrl(e.event_image_url, "event-images"),
        });
        eventFilesToDelete.push({
          bucket: "event-banners",
          path: getPathFromStorageUrl(e.banner_url, "event-banners"),
        });
        eventFilesToDelete.push({
          bucket: "event-pdfs",
          path: getPathFromStorageUrl(e.pdf_url, "event-pdfs"),
        });
      });

      await deleteFilesFromSupabase(
        supabase,
        eventFilesToDelete.filter((f) => f.path)
      );

      if (eventIdsToDelete.length > 0) {
        await supabase
          .from("event_registrations")
          .delete()
          .in("event_id", eventIdsToDelete);
        await supabase
          .from("events")
          .delete()
          .in("event_id", eventIdsToDelete);
        console.log(`Cleanup: Processed ${eventIdsToDelete.length} standalone events.`);
      }
    }

    console.log("Daily cleanup finished successfully.");
    res.status(200).json({ 
      success: true, 
      message: "Cleanup completed",
      processedFests: expiredFests?.length || 0,
      processedEvents: standaloneEvents?.length || 0
    });

  } catch (error) {
    console.error("Cleanup error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: "Cleanup failed", 
      details: error.message 
    });
  }
}
