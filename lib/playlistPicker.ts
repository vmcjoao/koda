import { Alert } from 'react-native';
import { router } from 'expo-router';
import {
  addProblemToPlaylist,
  listPlaylists,
} from '@/lib/playlists';

/**
 * Add a problem to a playlist. Uses a quick alert when few playlists exist;
 * otherwise routes to the playlists screen in pick mode.
 */
export async function addProblemToPlaylistFlow(
  problemId: string,
  problemTitle?: string,
): Promise<void> {
  const playlists = await listPlaylists();
  if (playlists.length === 0) {
    Alert.alert('No playlists yet', 'Create a playlist first, then add problems to it.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Create playlist', onPress: () => router.push('/playlists') },
    ]);
    return;
  }

  if (playlists.length <= 4) {
    Alert.alert(
      problemTitle ? `Add “${problemTitle}”` : 'Add to playlist',
      'Choose a playlist',
      [
        ...playlists.map((p) => ({
          text: p.name,
          onPress: async () => {
            await addProblemToPlaylist(p.id, problemId);
            Alert.alert('Added', `Saved to “${p.name}”.`);
          },
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ],
    );
    return;
  }

  router.push({ pathname: '/playlists', params: { addProblem: problemId } });
}
