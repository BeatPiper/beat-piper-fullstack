/*
  Warnings:

  - A unique constraint covering the columns `[spotifyId]` on the table `SpotifyUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spotifyId` to the `SpotifyUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SpotifyUser" ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyUser_spotifyId_key" ON "SpotifyUser"("spotifyId");
