export function predict(testCmValue, ownedClothes, pointKey) {
  const result = {};

  result.small = null;
  result.big = null;

  for (const item of ownedClothes) {
    const { name, measurements } = item;
    const { cmValue, fitEvaluation } = measurements[pointKey];

    const itemResult = {
      name: name,
      cmValue: cmValue,
      fitEvaluation: fitEvaluation,
    };

    if (cmValue === null) {
      continue;
      }
      

    if (testCmValue > cmValue) {
      if (result.small === null) {
        result.small = itemResult;
      } else {
        if (cmValue > result.small.cmValue) result.small = itemResult;
      }
    } else if (testCmValue === cmValue) {
      result.small = itemResult;
      result.big = itemResult;
    } else if (testCmValue < cmValue) {
      if (result.big === null) {
        result.big = itemResult;
      } else {
        if (cmValue < result.big.cmValue) {
          result.big = itemResult;
        }
      }
    }
  }

  return result;
}
