import { Audio } from 'expo-av';

const soundFiles = {
  tap: require('@/assets/sounds/tap.mp3'),
  success: require('@/assets/sounds/success.mp3'),
  confetti: require('@/assets/sounds/confetti.mp3'),
  fanfare: require('@/assets/sounds/fanfare.mp3'),
} as const;

type SoundName = keyof typeof soundFiles;

const loadedSounds: Partial<Record<SoundName, Audio.Sound>> = {};

export async function preloadSounds(): Promise<void> {
  const entries = Object.entries(soundFiles) as [SoundName, number][];
  await Promise.all(
    entries.map(async ([name, source]) => {
      const { sound } = await Audio.Sound.createAsync(source);
      loadedSounds[name] = sound;
    }),
  );
}

export async function playSound(name: SoundName, enabled: boolean): Promise<void> {
  if (!enabled) return;
  const sound = loadedSounds[name];
  if (!sound) return;
  try {
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch {
    // Silently ignore playback errors
  }
}

export async function unloadSounds(): Promise<void> {
  await Promise.all(
    Object.values(loadedSounds).map((s) => s?.unloadAsync()),
  );
}
