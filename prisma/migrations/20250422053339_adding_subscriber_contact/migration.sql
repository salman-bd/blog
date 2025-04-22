-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "siteTitle" TEXT NOT NULL DEFAULT 'Junayed Ahmed''s Blog',
    "siteDescription" TEXT NOT NULL DEFAULT 'Personal blog of Junayed Ahmed, sharing thoughts on travel, politics, religion, history, and nature.',
    "siteUrl" TEXT NOT NULL DEFAULT 'https://junayedahmed.com',
    "commentsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "primaryColor" TEXT NOT NULL DEFAULT '#F59E0B',
    "secondaryColor" TEXT NOT NULL DEFAULT '#78716C',
    "darkModeDefault" BOOLEAN NOT NULL DEFAULT false,
    "fromEmail" TEXT NOT NULL DEFAULT 'noreply@junayedahmed.com',
    "adminEmail" TEXT NOT NULL DEFAULT 'admin@junayedahmed.com',
    "newCommentNotification" BOOLEAN NOT NULL DEFAULT true,
    "newUserNotification" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");
