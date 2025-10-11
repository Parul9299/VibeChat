import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../api/firebaseConfig';

export default function MessageInput({ chatId }){
  const [text, setText] = useState('');
  const { user } = useContext(AuthContext);

  const onSend = async () => {
    if(!text.trim()) return;
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text,
      user: { uid: user.uid, name: user.displayName || user.email },
      createdAt: serverTimestamp(),
      type: 'text'
    });
    setText('');
  };

  return (
    <View style={{flexDirection:'row', padding:8}}>
      <TextInput value={text} onChangeText={setText} placeholder="Type a message" style={{flex:1, borderWidth:1, borderRadius:20, paddingHorizontal:12}} />
      <TouchableOpacity onPress={onSend} style={{justifyContent:'center', paddingHorizontal:12}}>
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  );
}
