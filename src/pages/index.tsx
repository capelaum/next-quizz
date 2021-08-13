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
  const [score, setScore] = useState<number>(0);
  const questionRef = useRef<QuestionModel>();

  async function loadQuestionsIds() {
    const response = await fetch(`${BASE_URL}/quiz`);
    const questionIds = await response.json();

    setQuestionsIds(questionIds);
  }

  async function loadQuestion(questionId: number) {
    const response = await fetch(`${BASE_URL}/questions/${questionId}`);
    const question = await response.json();
    const newQuestion = QuestionModel.createInstanceFromObject(question);
    setQuestion(newQuestion);
  }

  useEffect(() => {
    loadQuestionsIds();
  }, []);

  useEffect(() => {
    if (questionsIds.length > 0) {
      loadQuestion(questionsIds[0]);
    }
  }, [questionsIds]);

  useEffect(() => {
    questionRef.current = question;
  }, [question]);

  function finishedTime() {
    if (questionRef.current.isNotAnswered) {
      setQuestion(question.selectOption(-1));
    }

    setTimeout(() => {
      if (questionRef.current.isAnswered) {
        handleNextQuestion();
      }
    }, 5000);
  }

  function handleAnsweredQuestion(answeredQuestion: QuestionModel) {
    setQuestion(answeredQuestion);
    setScore(score + (answeredQuestion.isRight ? 1 : 0));
  }

  function getNextQuestionId() {
    const nextQuestionId = questionsIds.indexOf(question?.id) + 1;
    return questionsIds[nextQuestionId];
  }

  function handleNextQuestion() {
    const nextQuestionId = getNextQuestionId();
    nextQuestionId ? loadQuestion(nextQuestionId) : finishQuiz();
  }

  function finishQuiz() {
    router.push({
      pathname: "/result",
      query: {
        total: questionsIds.length,
        score,
      },
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Next Quiz | Home</title>
        <meta name="description" content="Next Quiz" />
      </Head>

      <div className={styles.score}>Score: {score}</div>

      <Quiz
        question={question}
        lastQuestion={getNextQuestionId() === undefined}
        handleAnsweredQuestion={handleAnsweredQuestion}
        handleNextQuestion={handleNextQuestion}
        finishedTime={finishedTime}
      />
    </div>
  );
}
