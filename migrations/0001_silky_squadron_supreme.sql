CREATE TABLE `todos` (
	`id` text NOT NULL,
	`userId` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`createdAt` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
