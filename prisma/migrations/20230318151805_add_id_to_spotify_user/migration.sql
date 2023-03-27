-- AlterTable
ALTER TABLE "SpotifyUser" ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyUser_spotifyId_key" ON "SpotifyUser"("spotifyId");
