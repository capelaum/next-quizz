import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "./firestore";

export type Option = {
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: number;
  text: string;
  options: Option[];
  category: string;
};

const addQuestion = async (question: Question) => {
  try {
    const questionsCollection = collection(db, "questions");
    const docRef = await addDoc(questionsCollection, question);

    console.log("Question: ", question);
    console.log("Question Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const getQuestions = async () => {
  const questionsCollection = collection(db, "questions");
  const questionsSnapshot = await getDocs(questionsCollection);
  const questionsList = questionsSnapshot.docs.map(
    doc => doc.data() as Question
  );

  return questionsList;
};

const getQuestionById = async (questionId: number) => {
  const questionsCollection = collection(db, "questions");
  const q = query(questionsCollection, where("id", "==", questionId));
  const querySnapshot = await getDocs(q);
  const questionList = querySnapshot.docs;

  if (questionList.length === 0) return;

  if (questionList.length === 1) {
    const question = questionList[0];
    return question;
  }

  if (questionList.length > 1) {
    throw new Error("Não pode ter 2 questões com mesmo ID!");
  }
};

const updateQuestion = async (question: Question) => {
  const questionToUpdate = await getQuestionById(question.id);
  const docRef = questionToUpdate.id;

  const updatedQuestion = { ...question };
  await setDoc(doc(db, "questions", docRef), updatedQuestion);
};

export { db, addQuestion, getQuestions, getQuestionById, updateQuestion };
