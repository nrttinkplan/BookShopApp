import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';

const API_KEY = 'Jhl9S8NaEzZtP3rAXKI4n1YI5yXpC4Xd';
const API_URL = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${API_KEY}`;

const App = () => {
  const [books, setBooks] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isStudentDiscount, setIsStudentDiscount] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    calculateTotal(books);
  }, [isStudentDiscount]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_URL);
      const booksWithPrice = response.data.results.books.map(book => ({
        ...book,
        price: Math.floor(Math.random() * 50) + 10,
        quantity: 0,
      }));
      setBooks(booksWithPrice);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const updateQuantity = (index, quantity) => {
    const updatedBooks = [...books];
    updatedBooks[index].quantity = parseInt(quantity) || 0;
    setBooks(updatedBooks);
  };

  const buyBook = (index) => {
    const updatedBooks = [...books];
    updatedBooks[index].quantity = books[index].quantity;
    setBooks(updatedBooks);
    calculateTotal(updatedBooks);
  };

  const calculateTotal = (updatedBooks, discountState = isStudentDiscount) => {
    let total = updatedBooks.reduce((sum, book) => sum + book.price * book.quantity, 0);
    if (discountState) {
      total *= 0.8; 
    }
    setTotalPrice(total.toFixed(2));
  };

  const toggleStudentDiscount = () => {
    const newDiscountState = !isStudentDiscount;
    setIsStudentDiscount(newDiscountState);
    calculateTotal(books, newDiscountState);
  };

  const renderBookItem = ({ item, index }) => (
    <View style={styles.bookItem}>
      <Image source={{ uri: item.book_image }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text>{item.author}</Text>
        <Text>Fiyat: ₺{item.price}</Text>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={item.quantity.toString()}
          onChangeText={(text) => updateQuantity(index, text)}
        />
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => buyBook(index)}
        >
          <Text style={styles.buyButtonText}>Satın Al</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Kitap Mağazası 📚</Text>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.primary_isbn10}
      />
      <View style={styles.totalBar}>
        <Text style={styles.totalText}>Toplam: ₺{totalPrice}</Text>
        <View style={styles.discountSwitch}>
          <Text>Öğrenci İndirimi</Text>
          <Switch
            value={isStudentDiscount}
            onValueChange={toggleStudentDiscount}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop: 20,
    paddingBottom: 10,
    marginLeft: 10,
    textAlign: 'center',
    color: '#DA8359',

  },
  bookItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  bookImage: {
    width: 100,
    height: 150,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#A5B68D',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    width: 50,
    marginVertical: 5,
  },
  buyButton: {
    backgroundColor: '#E78F81',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  discountSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default App;


