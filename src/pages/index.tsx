import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

import { Question } from "../components/Question";
import AnswerModel from "../models/answer";
import QuestionModel from "../models/question";

import styles from "../styles/Home.module.scss";

const questionTest = new QuestionModel(1, "Qual é a melhor cor?", [
  AnswerModel.isWrong("Verde"),
  AnswerModel.isWrong("Vermelha"),
  AnswerModel.isWrong("Azul"),
  AnswerModel.isCorrect("Preta"),
]);

export default function Home() {
  const [question, setQuestion] = useState(questionTest);

  function onResponse(index: number) {
    setQuestion(question.selectAnswer(index));
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Next Quiz | Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.questionContainer}>
        <Question question={question} onResponse={onResponse} />
      </div>
    </div>
  );
}
