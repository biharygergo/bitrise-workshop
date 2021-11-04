import { render } from "@testing-library/react-native";
import React from "react";
import { IQuiz } from "../interfaces";
import { Game } from "../screens";
import { IProps } from "../screens/Game";

jest.mock("../utils/helpers", () => {
  const originalMethods = jest.requireActual("../utils/helpers");
  return {
    ...originalMethods,
    shuffle: jest.fn((arr) => arr),
  };
});

const mockProps: IProps = {
  currentIndex: 0,
  isLoading: false,
  livea: 3,
  questions: [],
  handleAnswerSelected: jest.fn(),
  onResetGame: jest.fn(),
};

describe("Game", () => {
  it("should match snapshot", () => {
    const renderedGame = render(<Game {...mockProps} />);
    expect(renderedGame.toJSON()).toMatchSnapshot();
  });

  it("should match snapshot while loading", () => {
    const renderedGame = render(
      <Game {...{ ...mockProps, isLoading: true }} />
    );
    expect(renderedGame.toJSON()).toMatchSnapshot();
  });

  it("should match snapshot with questions", () => {
    const question: IQuiz = {
      question: "How are you?",
      correct_answer: "Great",
      incorrect_answers: ["Bad", "Meh", "Bleh"],
      category: "feelings",
      type: "multiple",
      difficulty: "easy",
    };
    const renderedGame = render(
      <Game {...{ ...mockProps, questions: [question] }} />
    );
    expect(renderedGame.toJSON()).toMatchSnapshot();
  });
});
