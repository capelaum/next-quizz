import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { Quiz } from "../components/Quiz";
import QuestionModel from "../models/question";

import styles from "../styles/Home.module.scss";

const BASE_URL = "http://localhost:3000/api";

export default function Home() {
  const router = useRouter();

  const [question, setQuestion] = useState<QuestionModel>();
  const [questionsIds, setQuestionsIds] = useState<number[]>([]);
  const [rightQuestions, setRightQuestions] = useState<number>(0);
  const questionRef = useRef<QuestionModel>();

  async function loadQuestionIds() {
    const response = await fetch(`${BASE_URL}/quiz`);
    const questionIds = await response.json();
    // console.log("🚀 ~ questionIds", questionIds);

    setQuestionsIds(questionIds);
  }

  async function loadQuestion(questionId: number) {
    const response = await fetch(`${BASE_URL}/questions/${questionId}`);
    const question = await response.json();
    const newQuestion = QuestionModel.createInstanceFromObject(question);
    setQuestion(newQuestion);
  }

  useEffect(() => {
    loadQuestionIds();
    // questionRef.current = question;
  }, []);

  useEffect(() => {
    if (questionsIds.length > 0) {
      loadQuestion(questionsIds[0]);
    }
  }, [questionsIds]);

  function handleAnsweredQuestion(answeredQuestion: QuestionModel) {
    setQuestion(answeredQuestion);
    const isRight = answeredQuestion.isRight;
    setRightQuestions(rightQuestions + (isRight ? 1 : 0));
  }

  function getNextQuestionId() {
    const nextQuestionId = questionsIds.indexOf(question?.id) + 1;
    return questionsIds[nextQuestionId];
  }

  function handleNextQuestion() {
    const nextQuestionId = getNextQuestionId();
    nextQuestionId ? goToNextQuestion(nextQuestionId) : finishQuiz();
  }

  function goToNextQuestion(nextQuestionId: number) {
    loadQuestion(nextQuestionId);
  }

  function finishQuiz() {
    router.push({
      pathname: "/result",
      query: {
        total: questionsIds.length,
        score: rightQuestions,
      },
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Next Quiz | Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Quiz
        question={question}
        lastQuestion={getNextQuestionId() === undefined}
        handleAnsweredQuestion={handleAnsweredQuestion}
        handleNextQuestion={handleNextQuestion}
      />
    </div>
  );
}
