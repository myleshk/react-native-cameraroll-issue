import {
  Album,
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function App(): JSX.Element {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const loadAlbums = useCallback(async () => {
    const _albums = await CameraRoll.getAlbums({
      assetType: 'All',
      albumType: 'All',
    });
    setAlbums(_albums);
  }, [setAlbums]);

  const selectAlbum = useCallback(
    async (album: Album) => {
      const _photos = (
        await CameraRoll.getPhotos({
          first: 10,
          groupTypes: album.type,
          groupName: album.title,
          include: [
            'fileSize',
            'filename',
            'albums',
            'fileExtension',
            'imageSize',
            'location',
            'orientation',
            'playableDuration',
          ],
        })
      ).edges;

      setSelectedAlbum(album);
      setPhotos(_photos);
    },
    [setPhotos, setSelectedAlbum],
  );

  useEffect(() => {
    loadAlbums().then(() => {
      console.log('Loaded');
    });
  }, [loadAlbums]);

  return (
    <SafeAreaView style={styles.area}>
      {selectedAlbum && (
        <Button
          title="Back"
          onPress={() => {
            setSelectedAlbum(null);
            setPhotos([]);
          }}
        />
      )}
      {selectedAlbum ? (
        <FlatList
          horizontal
          contentContainerStyle={styles.listContent}
          data={photos}
          renderItem={({item: photo}) => (
            <View>
              <Text style={styles.item}>
                {JSON.stringify(photo.node, null, 2)}
              </Text>
              <Image
                source={{uri: photo.node.image.uri}}
                style={styles.image}
              />
            </View>
          )}
          keyExtractor={photo => photo.node.id}
        />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={albums}
          renderItem={({item: album}) => (
            <TouchableOpacity
              onPress={() => {
                selectAlbum(album);
              }}>
              <Text style={styles.item}>{JSON.stringify(album, null, 2)}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={album => album.title}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContent: {
    padding: 10,
  },
  item: {
    marginHorizontal: 10,
  },
  image: {
    height: 300,
    marginHorizontal: 10,
  },
});

export default App;
