import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderComponent from '../HeaderComponent';

export const QuestsScreen = () => {
  const [quests, setQuests] = useState<any[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [sortAscending, setSortAscending] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Стан для логіки квізу
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    loadQuests();
    loadCompletedQuests();
  }, []);

  const loadQuests = () => {
    // Додано до кожного квесту 5 запитань у полі quizQuestions
    const questData = [
      {
        id: '1',
        title: 'Van Gogh’s Mystery',
        description: 'Solve the hidden puzzle in Starry Night.',
        difficulty: 'Easy',
        quizQuestions: [
          {
            question: 'What year was Starry Night painted?',
            options: ['1889', '1875', '1890', '1885'],
            correctAnswer: '1889',
          },
          {
            question: 'In which museum is Starry Night primarily exhibited?',
            options: [
              'Museum of Modern Art',
              'The Louvre',
              'Van Gogh Museum',
              'National Gallery',
            ],
            correctAnswer: 'Museum of Modern Art',
          },
          {
            question: 'What emotion is most associated with Starry Night?',
            options: ['Melancholy', 'Joy', 'Anger', 'Calm'],
            correctAnswer: 'Melancholy',
          },
          {
            question: 'Which technique is heavily used in Starry Night?',
            options: ['Impasto', 'Pointillism', 'Cubism', 'Surrealism'],
            correctAnswer: 'Impasto',
          },
          {
            question: 'What inspired Van Gogh to paint Starry Night?',
            options: [
              'His view from the asylum',
              'A dream',
              'The sea',
              'Rural landscapes',
            ],
            correctAnswer: 'His view from the asylum',
          },
        ],
      },
      {
        id: '2',
        title: 'Rembrandt’s Challenge',
        description: 'Find the missing details in The Night Watch.',
        difficulty: 'Medium',
        quizQuestions: [
          {
            question: 'In which year was The Night Watch completed?',
            options: ['1642', '1650', '1630', '1660'],
            correctAnswer: '1642',
          },
          {
            question: 'What is a distinctive feature of The Night Watch?',
            options: [
              'Dynamic use of light',
              'Abstract composition',
              'Minimalist style',
              'Pastel colors',
            ],
            correctAnswer: 'Dynamic use of light',
          },
          {
            question:
              'Which technique did Rembrandt employ in The Night Watch?',
            options: ['Chiaroscuro', 'Fresco', 'Watercolor', 'Collage'],
            correctAnswer: 'Chiaroscuro',
          },
          {
            question: 'The Night Watch is renowned for its portrayal of:',
            options: [
              'A military company',
              'A royal family',
              'Mythical creatures',
              'A landscape',
            ],
            correctAnswer: 'A military company',
          },
          {
            question: 'In which city can you primarily view The Night Watch?',
            options: ['Amsterdam', 'Paris', 'London', 'Rome'],
            correctAnswer: 'Amsterdam',
          },
        ],
      },
      {
        id: '3',
        title: 'Vermeer’s Secret',
        description: 'Discover the story behind the Girl with a Pearl Earring.',
        difficulty: 'Hard',
        quizQuestions: [
          {
            question:
              'Which feature is most noted in the Girl with a Pearl Earring?',
            options: [
              'The earring',
              'The hairstyle',
              'The background',
              'The lighting',
            ],
            correctAnswer: 'The earring',
          },
          {
            question: 'Who is the artist behind Girl with a Pearl Earring?',
            options: [
              'Johannes Vermeer',
              'Rembrandt',
              'Leonardo da Vinci',
              'Michelangelo',
            ],
            correctAnswer: 'Johannes Vermeer',
          },
          {
            question:
              'What style is the painting Girl with a Pearl Earring associated with?',
            options: ['Baroque', 'Impressionism', 'Renaissance', 'Modernism'],
            correctAnswer: 'Baroque',
          },
          {
            question:
              'What is the likely reason behind the girl’s enigmatic expression?',
            options: ['Mystery', 'Happiness', 'Anger', 'Sadness'],
            correctAnswer: 'Mystery',
          },
          {
            question:
              'Which technique did Vermeer famously use in this painting?',
            options: [
              'Use of light and shadow',
              'Cubism',
              'Sfumato',
              'Collage',
            ],
            correctAnswer: 'Use of light and shadow',
          },
        ],
      },
    ];
    setQuests(questData);
  };

  const loadCompletedQuests = async () => {
    const storedCompletedQuests = await AsyncStorage.getItem(
      'completed_quests',
    );
    if (storedCompletedQuests) {
      setCompletedQuests(JSON.parse(storedCompletedQuests));
    }
  };

  const completeQuest = async (id: string) => {
    if (!completedQuests.includes(id)) {
      const updatedCompleted = [...completedQuests, id];
      setCompletedQuests(updatedCompleted);
      await AsyncStorage.setItem(
        'completed_quests',
        JSON.stringify(updatedCompleted),
      );
    }
    Alert.alert('Congrats!', 'You have completed this quest!');
  };

  const openQuestDetails = (quest: any) => {
    setSelectedQuest(quest);
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const sortQuests = () => {
    const sorted = [...quests].sort((a, b) =>
      sortAscending
        ? a.difficulty.localeCompare(b.difficulty)
        : b.difficulty.localeCompare(a.difficulty),
    );
    setQuests(sorted);
    setSortAscending(!sortAscending);
  };

  // Обробка відповіді користувача
  const handleAnswer = (selectedOption: string) => {
    const currentQuestion = selectedQuest.quizQuestions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
      Alert.alert('Correct!', 'You got it right!');
    } else {
      Alert.alert('Incorrect', 'Better luck with the next one.');
    }
    // Перехід до наступного питання або завершення квізу
    if (currentQuestionIndex + 1 < selectedQuest.quizQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Функція для скидання станів квізу при закритті модального вікна
  const resetAndClose = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setModalVisible(false);
    setSelectedQuest(null);
  };

  return (
    <>
      <HeaderComponent title="Holland" />
      <View style={styles.container}>
        {/* Фільтр квестів */}
        <TouchableOpacity style={styles.sortButton} onPress={sortQuests}>
          <Text style={styles.sortButtonText}>
            {sortAscending ? 'Sort: Easy First' : 'Sort: Hard First'}
          </Text>
        </TouchableOpacity>

        {/* Список квестів */}
        <FlatList
          data={quests}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.card,
                completedQuests.includes(item.id) && styles.completedCard,
              ]}
              activeOpacity={0.8}
              onPress={() => openQuestDetails(item)}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.difficulty}>
                Difficulty: {item.difficulty}
              </Text>
              {completedQuests.includes(item.id) && (
                <Icon name="checkmark-circle" size={24} color="#FFC107" />
              )}
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Деталі квесту та логіка квізу */}
      {selectedQuest && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={resetAndClose}>
          <Animated.View style={[styles.modalContainer, {opacity: fadeAnim}]}>
            <LinearGradient
              colors={['#000', '#222']}
              style={styles.modalBackground}
            />
            {!quizStarted ? (
              // Початковий екран з деталями квесту
              <View>
                <Text style={styles.modalTitle}>{selectedQuest.title}</Text>
                <Text style={styles.modalDescription}>
                  {selectedQuest.description}
                </Text>
                <Text style={styles.modalDifficulty}>
                  Difficulty: {selectedQuest.difficulty}
                </Text>
                <TouchableOpacity
                  style={styles.startQuizButton}
                  onPress={() => setQuizStarted(true)}>
                  <Text style={styles.startQuizButtonText}>Start Quiz</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={resetAndClose}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : !quizCompleted ? (
              // Екран проходження квізу
              <View>
                <Text style={styles.modalTitle}>
                  Question {currentQuestionIndex + 1} of{' '}
                  {selectedQuest.quizQuestions.length}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedQuest.quizQuestions[currentQuestionIndex].question}
                </Text>
                {selectedQuest.quizQuestions[currentQuestionIndex].options.map(
                  (option: string, index: number) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.optionButton}
                      onPress={() => handleAnswer(option)}>
                      <Text style={styles.optionButtonText}>{option}</Text>
                    </TouchableOpacity>
                  ),
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={resetAndClose}>
                  <Text style={styles.closeButtonText}>Close Quiz</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Екран завершення квізу
              <View>
                <Text style={styles.modalTitle}>Quiz Completed!</Text>
                <Text style={styles.modalDescription}>
                  Your Score: {score} / {selectedQuest.quizQuestions.length}
                </Text>
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => {
                    completeQuest(selectedQuest.id);
                    resetAndClose();
                  }}>
                  <Text style={styles.completeButtonText}>
                    Mark as Completed
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={resetAndClose}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 15,
  },
  sortButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  sortButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
    position: 'relative',
  },
  completedCard: {
    backgroundColor: '#333',
    borderColor: '#FFC107',
    borderWidth: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 5,
  },
  difficulty: {
    fontSize: 14,
    color: '#FFC107',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalDifficulty: {
    fontSize: 16,
    color: '#FFA500',
    marginBottom: 10,
    textAlign: 'center',
  },
  startQuizButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  startQuizButtonText: {
    color: 'white',
    fontSize: 16,
  },
  optionButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  optionButtonText: {
    color: 'white',
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: '#E91E63',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
