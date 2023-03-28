import BeatSaverAPI from 'beatsaver-api';
import { type MapDetail } from 'beatsaver-api/lib/models/MapDetail';
import { type MapVersion } from 'beatsaver-api/lib/models/MapVersion';
import { SortOrder } from 'beatsaver-api/lib/api/search';

export type Maps = MapDetail[];

interface TrackWithMaps {
  track: SpotifyApi.TrackObjectFull;
  maps: Maps;
}

interface BeatSaberPlaylist {
  playlistTitle: string;
  playlistAuthor: string;
  playlistDescription: string;
  syncURL?: string;
  image: string | null;
  songs: BeatSaberPlaylistSong[];
}

interface BeatSaberPlaylistSong {
  uploader: string;
  name: string;
  key: string;
  hash: string;
}

const BEATSAVER_CHUNKS = Number(process.env.BEATSAVER_CHUNKS) || 10;
const BEATSAVER_TIMEOUT = Number(process.env.BEATSAVER_TIMEOUT) || 1200;

export default class BeatSaverClient {
  private readonly api: BeatSaverAPI;

  constructor() {
    this.api = new BeatSaverAPI({
      AppName: 'Beat Piper',
      Version: '0.0.1',
    });
  }

  static getLatestVersion(map: MapDetail): MapVersion {
    const { versions } = map;
    versions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return versions[0];
  }

  async searchInBatches(tracks: SpotifyApi.TrackObjectFull[]): Promise<TrackWithMaps[]> {
    // create chunks of tracks
    const chunks = [];
    for (let i = 0; i < tracks.length; i += BEATSAVER_CHUNKS) {
      chunks.push(tracks.slice(i, i + BEATSAVER_CHUNKS));
    }
    const results: TrackWithMaps[] = [];
    // search for each chunk
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(chunk.map(track => this.search(track)));
      results.push(...chunkResults);
      // wait for 1 second between each search
      await new Promise(resolve => setTimeout(resolve, BEATSAVER_TIMEOUT));
    }
    return results;
  }

  async search(track: SpotifyApi.TrackObjectFull): Promise<TrackWithMaps> {
    const results = await this.api.searchMaps({
      q: `${track.name} ${track.artists[0].name}`, // TODO: is this query good
      sortOrder: SortOrder.Relevance,
    }); // TODO: also get the following pages?
    return {
      track,
      maps: results.docs.filter(map => map.name.toLowerCase().includes(track.name.toLowerCase())), // TODO: maybe use Levenshtein distance
    };
  }
}

export async function matchTracks({ tracks }: { tracks: SpotifyApi.TrackObjectFull[] }) {
  try {
    const beatSaver = new BeatSaverClient();
    // TODO: handle rate limit
    return await beatSaver.searchInBatches(tracks);
  } catch (err) {
    console.error(err);
  }

  return null;
}

export async function createPlaylist(
  playlistTitle: string,
  playlistDescription: string,
  imageData: string | null,
  maps: Maps
): Promise<BeatSaberPlaylist> {
  const songs = maps.map(map => ({
    key: map.id,
    hash: BeatSaverClient.getLatestVersion(map).hash,
    name: map.name,
    uploader: map.uploader.name,
  }));

  return {
    playlistTitle,
    playlistDescription,
    playlistAuthor: 'Beat Piper',
    songs,
    image: imageData,
  };
}
