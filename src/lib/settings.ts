// Default settings for the blog
// This file doesn't use 'use server' directive since it exports an object

export const defaultSettings = {
  general: {
    siteTitle: "Junayed Ahmed's Blog",
    siteDescription:
      "Personal blog of Junayed Ahmed, sharing thoughts on travel, politics, religion, history, and nature.",
    siteUrl: "https://junayedahmed.com",
    commentsEnabled: true,
  },
  appearance: {
    primaryColor: "#F59E0B",
    secondaryColor: "#78716C",
    darkModeDefault: false,
  },
  email: {
    fromEmail: "noreply@junayedahmed.com",
    adminEmail: "admin@junayedahmed.com",
    newCommentNotification: true,
    newUserNotification: true,
  },
}

// Helper function to get default settings
// This is async to match the pattern of fetching from a database
export async function getDefaultSettings() {
  return defaultSettings
}
