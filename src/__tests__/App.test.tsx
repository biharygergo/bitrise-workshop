import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import fetch from "jest-fetch-mock";

import App from "../App";
import { maxLives, maxQuestions } from "../config";
import { IResponse } from "../interfaces";

const mockResponse: IResponse = {
  response_code: 200,
  results: [
    {
      question: "How are you?",
      correct_answer: "Great",
      incorrect_answers: ["Bad", "Meh", "Bleh"],
      category: "feelings",
      type: "multiple",
      difficulty: "easy",
    },
  ],
};

describe("App", () => {
  beforeEach(() => {
    fetch.mockResponse(JSON.stringify(mockResponse));
  });

  it("should start with max lives", async () => {
    const { findAllByTestId } = render(<App />);
    const hearts = await findAllByTestId("heart-full");

    expect(hearts).toHaveLength(maxLives);
  });

  it("should show first step text", async () => {
    const { findByTestId } = render(<App />);

    const currentStep = await findByTestId("currentStep");

    expect(currentStep.props.children).toEqual(`1 / ${maxQuestions}`);
  });

  it("should decrease lives when incorrect selected", async () => {
    const mountedApp = render(<App />);

    const question = await mountedApp.findByTestId("question");
    expect(question.props.children).toEqual(mockResponse.results[0].question);

    const badButton = await mountedApp.getByText(
      mockResponse.results[0].incorrect_answers[0]
    );
    await fireEvent.press(badButton);

    const hearts = await mountedApp.findAllByTestId("heart-full");
    expect(hearts).toHaveLength(maxLives - 1);
  });

  it("should increase stepCounter when correct is selected", async () => {
    const mountedApp = render(<App />);

    const correctButton = await waitFor(() =>
      mountedApp.getByText(mockResponse.results[0].correct_answer)
    );

    const question = await mountedApp.findByTestId("question");
    expect(question.props.children).toEqual(mockResponse.results[0].question);

    await fireEvent.press(correctButton);

    const currentStep = await mountedApp.findByTestId("currentStep");
    expect(currentStep.props.children).toEqual(`2 / ${maxQuestions}`);
  });
});
