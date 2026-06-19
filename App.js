import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView, Keyboard } from 'react-native';

export default function App() {
  const [items, setItems] = useState([]);
  const [inputText, setInputText] = useState('');

  // 1. App khulte hi phone ki memory se puraana data load karein
  useEffect(() => {
    loadOfflineData();
  }, []);

  const loadOfflineData = async () => {
    try {
      const savedData = await SecureStore.getItemAsync('my_offline_list');
      if (savedData !== null) {
        setItems(JSON.parse(savedData));
      }
    } catch (error) {
      console.log("Data load karne mein dikkat aayi", error);
    }
  };

  // 2. Naya item add karne aur phone mein save karne ka function
  const addItem = async () => {
    if (inputText.trim() === '') return;

    const newItem = {
      id: Date.now().toString(), // Har item ke liye ek unique ID
      name: inputText
    };

    const updatedList = [...items, newItem];
    setItems(updatedList);
    setInputText('');
    Keyboard.dismiss(); // Input field se keyboard hata dega

    // Phone ki memory mein save karein
    await SecureStore.setItemAsync('my_offline_list', JSON.stringify(updatedList));
  };

  // 3. Item delete karne aur phone se hatane ka function
  const deleteItem = async (id) => {
    const updatedList = items.filter(item => item.id !== id);
    setItems(updatedList);

    // Phone ki memory mein update karein
    await SecureStore.setItemAsync('my_offline_list', JSON.stringify(updatedList));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Offline Item Manager</Text>

      {/* Input Box aur Add Button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Naya item likhein..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Items dikhane ke liye List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item.id)}>
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>List khali hai. Kuch add karein!</Text>
        }
      />
    </SafeAreaView>
  );
}

// Design/Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  },
});
