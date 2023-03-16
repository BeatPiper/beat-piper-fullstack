-- CreateTable
CREATE TABLE "SpotifyUser" (
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyUser_userId_key" ON "SpotifyUser"("userId");

-- AddForeignKey
ALTER TABLE "SpotifyUser" ADD CONSTRAINT "SpotifyUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
