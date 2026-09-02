CREATE TABLE `game_levels` (
	`id` text PRIMARY KEY NOT NULL,
	`gameId` text NOT NULL,
	`title` text NOT NULL,
	`levelOrder` integer NOT NULL,
	`rules` text NOT NULL,
	`unlockCondition` text,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` text PRIMARY KEY NOT NULL,
	`lessonId` text NOT NULL,
	`title` text NOT NULL,
	`gameType` text NOT NULL,
	`description` text NOT NULL,
	`thumbnailTone` text NOT NULL,
	`status` text DEFAULT 'upcoming' NOT NULL,
	`sortOrder` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`topic` text NOT NULL,
	`accent` text NOT NULL,
	`status` text DEFAULT 'upcoming' NOT NULL,
	`sortOrder` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `player_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profileKey` text NOT NULL,
	`nickname` text NOT NULL,
	`avatarId` text NOT NULL,
	`totalScore` integer DEFAULT 0 NOT NULL,
	`coins` integer DEFAULT 0 NOT NULL,
	`inventory` text DEFAULT '' NOT NULL,
	`effectId` text DEFAULT '' NOT NULL,
	`themeId` text DEFAULT '' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `player_profiles_profileKey_unique` ON `player_profiles` (`profileKey`);--> statement-breakpoint
CREATE TABLE `player_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`levelId` text NOT NULL,
	`highScore` integer DEFAULT 0 NOT NULL,
	`stars` integer DEFAULT 0 NOT NULL,
	`completedAt` integer,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `player_progress_user_level_idx` ON `player_progress` (`userId`,`levelId`);--> statement-breakpoint
CREATE TABLE `teacher_roster_filter_presets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`teacherOpenId` text NOT NULL,
	`name` text NOT NULL,
	`search` text NOT NULL,
	`minScore` integer,
	`maxScore` integer,
	`level` integer,
	`isDefault` integer DEFAULT 0 NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teacher_roster_preset_owner_name_idx` ON `teacher_roster_filter_presets` (`teacherOpenId`,`name`);--> statement-breakpoint
CREATE TABLE `teacher_roster_report_preferences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`teacherOpenId` text NOT NULL,
	`className` text DEFAULT '' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teacher_roster_report_preferences_teacherOpenId_unique` ON `teacher_roster_report_preferences` (`teacherOpenId`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`loginMethod` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`lastSignedIn` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);