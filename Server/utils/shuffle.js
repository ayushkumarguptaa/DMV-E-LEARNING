export const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/* ===== OPTION SHUFFLE WITH CORRECT INDEX FIX ===== */
export const shuffleOptions = (question) => {
  const options = question.options.map((opt, idx) => ({
    value: opt,
    index: idx,
  }));

  const shuffled = shuffleArray(options);

  return {
    question: question.question,
    options: shuffled.map((o) => o.value),
    correctIndex: shuffled.findIndex(
      (o) => o.index === question.correctIndex
    ),
  };
};
