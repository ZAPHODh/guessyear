export default {
  dashboard: {
    title: "Admin Dashboard",
    subtitle: "Manage daily images and game content",
    stats: {
      totalImages: "Total Images",
      scheduled: "Scheduled", 
      unscheduled: "Unscheduled",
      gamesPlayed: "Games Played"
    },
    todayImage: {
      title: "Today's Image",
      subtitle: "Current image for {date}",
      noImage: "No image scheduled for today",
      setRandom: "Set Random Image",
      chooseSpecific: "Choose Specific Image",
      year: "Year: {year}",
      gamesPlayed: "Games played: {count}"
    },
    queue: {
      title: "Image Queue",
      subtitle: "Upcoming scheduled images",
      noQueue: "No images in queue",
      today: "Today",
      tomorrow: "Tomorrow", 
      comingDays: "Coming days"
    },
    quickActions: {
      title: "Quick Actions",
      uploadNew: "Upload New Image",
      scheduleImages: "Schedule Images"
    },
    recentImages: {
      title: "Recent Images",
      noScheduled: "No scheduled images",
      year: "Year {year}"
    }
  },
  images: {
    title: "Image Management", 
    subtitle: "Upload, schedule, and manage daily images",
    upload: {
      title: "Upload New Image",
      subtitle: "Add a new image to the collection",
      button: "Upload New Image"
    },
    scheduled: {
      title: "Scheduled Images ({count})",
      subtitle: "Images scheduled for specific dates",
      noImages: "No scheduled images",
      today: "Today",
      tomorrow: "Tomorrow",
      past: "Past",
      year: "Year: {year}",
      games: "Games: {count}",
      queueNext: "Queue Next",
      queueTomorrow: "Queue Tomorrow"
    },
    unscheduled: {
      title: "Unscheduled Images ({count})",
      subtitle: "Images not yet scheduled for any date",
      noImages: "No unscheduled images",
      year: "Year: {year}",
      queueNext: "Queue Next",
      queueTomorrow: "Queue Tomorrow"
    },
    all: {
      title: "All Images ({count})",
      subtitle: "Complete overview of all images in the system",
      noImages: "No images found",
      unscheduled: "Not Scheduled",
      future: "Scheduled",
      notScheduled: "Unscheduled"
    },
    bulk: {
      title: "Bulk Schedule Random Images",
      subtitle: "Automatically schedule random images for multiple days",
      startDate: "Start Date",
      days: "Number of Days",
      button: "Bulk Schedule ({count} available)",
      success: "Scheduled {count} images"
    },
    tabs: {
      upload: "Upload",
      all: "All Images",
      scheduled: "Scheduled", 
      unscheduled: "Unscheduled",
      bulk: "Bulk Actions"
    }
  },
  forms: {
    upload: {
      title: "Upload New Image",
      subtitle: "Add a new image to the daily collection",
      cloudinaryUrl: {
        label: "Cloudinary URL",
        placeholder: "https://res.cloudinary.com/...",
        description: "The URL of the image from your Cloudinary account",
        error: "Please enter a valid URL"
      },
      year: {
        label: "Year",
        description: "The year when this photo was taken",
        minError: "Year must be after 1800",
        maxError: "Year cannot be in the future"
      },
      description: {
        label: "Description (Optional)",
        placeholder: "Brief description of the image...",
        description: "A brief description of the image content"
      },
      tip: {
        label: "Tip (Optional)",
        placeholder: "Helpful tip for guessing the year...",
        description: "A hint to help players guess the correct year"
      },
      button: "Upload Image",
      success: "Image uploaded successfully",
      error: "Failed to upload image"
    },
    edit: {
      title: "Edit Image",
      subtitle: "Update image details and schedule", 
      date: {
        label: "Scheduled Date",
        description: "The date when this image should be featured",
        error: "Invalid date format"
      },
      description: {
        label: "Description (Optional)",
        placeholder: "Brief description of the image...",
        description: "A brief description of the image content"
      },
      tip: {
        label: "Tip (Optional)",
        placeholder: "Helpful tip for guessing the year...",
        description: "A hint to help players guess the correct year"
      },
      saveButton: "Save Changes",
      deleteButton: "Delete Image",
      deleteTitle: "Delete Image",
      deleteDescription: "Are you sure you want to delete this image? This action cannot be undone.",
      cancel: "Cancel",
      delete: "Delete",
      updateSuccess: "Image updated successfully",
      updateError: "Failed to update image",
      deleteSuccess: "Image deleted successfully", 
      deleteError: "Failed to delete image",
      deleteBlocked: "Cannot delete image with existing game progress",
      year: "Year: {year}",
      gamesPlayed: "Games played: {count}"
    }
  },
  multiLanguage: {
    languages: {
      english: "English",
      portuguese: "Português", 
      french: "Français",
      spanish: "Español",
      german: "Deutsch",
      italian: "Italiano"
    },
    languagesCount: "languages"
  },
  actions: {
    edit: "Edit",
    delete: "Delete",
    schedule: "Schedule",
    confirmDelete: "Are you sure you want to delete this image?"
  }
} as const