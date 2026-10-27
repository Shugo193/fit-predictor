import { predict } from "./predict.js";
import test from "node:test";
import assert from "node:assert";

test("手持ちが0着なら、肩幅の小さい側も大きい側もnull", () => {
  const testCmValue = 46;
  const pointKey = "shoulderWidth";
  const ownedClothes = [];

  const result = predict(testCmValue, ownedClothes, pointKey);

  assert.strictEqual(result.small, null);
  assert.strictEqual(result.big, null);
});

test("46cmが44cmと48cmに挟まれたら、小さい側がA、大きい側がB", () => {
  const testCmValue = 46;
  const pointKey = "shoulderWidth";
  const ownedClothes = [];
  ownedClothes.push({ name: "A", measurements: { [pointKey]: { cmValue: 44, fitEvaluation: 0 } } });
  ownedClothes.push({ name: "B", measurements: { [pointKey]: { cmValue: 48, fitEvaluation: 1 } } });

  const result = predict(testCmValue, ownedClothes, pointKey);

  assert.deepStrictEqual(result.small, {
    name: "A",
    cmValue: 44,
    fitEvaluation: 0,
  });

  assert.deepStrictEqual(result.big, {
    name: "B",
    cmValue: 48,
    fitEvaluation: 1,
  });
});

test("寸法がnullの時、とばす", () => {
  const testCmValue = 46;
  const pointKey = "shoulderWidth";
  const ownedClothes = [];
  ownedClothes.push({ name: "A", measurements: { [pointKey]: { cmValue: 47, fitEvaluation: 0 } } });
  ownedClothes.push({ name: "B", measurements: { [pointKey]: { cmValue: 48, fitEvaluation: 0 } } });
  ownedClothes.push({ name: "C", measurements: { [pointKey]: { cmValue: null, fitEvaluation: null } } });

  const result = predict(testCmValue, ownedClothes, pointKey);
  assert.strictEqual(result.small, null);

  assert.deepStrictEqual(result.big, {
    name: "A",
    cmValue: 47,
    fitEvaluation: 0,
  });
});

test("小さい本物の服がないとき、寸法nullの服が小さい側に入らない", () => {
  const testCmValue = 44;
  const pointKey = "shoulderWidth";
  const ownedClothes = [];
  ownedClothes.push({ name: "A", measurements: { [pointKey]: { cmValue: 44, fitEvaluation: 0 } } });
  ownedClothes.push({ name: "B", measurements: { [pointKey]: { cmValue: 48, fitEvaluation: 1 } } });
  const result = predict(testCmValue, ownedClothes, pointKey);

  assert.deepStrictEqual(result.small, {
    name: "A",
    cmValue: 44,
    fitEvaluation: 0,
  });

  assert.deepStrictEqual(result.big, {
    name: "A",
    cmValue: 44,
    fitEvaluation: 0,
  });
});

test("どの服よりも小さいとき、小さい側はnull/大きい側はA", () => {
  const testCmValue = 20;
  const pointKey = "shoulderWidth";
  const ownedClothes = [];
  ownedClothes.push({ name: "A", measurements: { [pointKey]: { cmValue: 44, fitEvaluation: 0 } } });
  ownedClothes.push({ name: "B", measurements: { [pointKey]: { cmValue: 48, fitEvaluation: 1 } } });
  const result = predict(testCmValue, ownedClothes, pointKey);

  assert.strictEqual(result.small, null);

  assert.deepStrictEqual(result.big, {
    name: "A",
    cmValue: 44,
    fitEvaluation: 0,
  });
});
test("どの服よりも大きいとき、小さい側はB/大きい側はnull", () => {
  const testCmValue = 1000;
  const pointKey = "shoulderWidth";
  const ownedClothes = [];
  ownedClothes.push({ name: "A", measurements: { [pointKey]: { cmValue: 44, fitEvaluation: 0 } } });
  ownedClothes.push({ name: "B", measurements: { [pointKey]: { cmValue: 48, fitEvaluation: 1 } } });
  const result = predict(testCmValue, ownedClothes, pointKey);

  assert.deepStrictEqual(result.small, {
    name: "B",
    cmValue: 48,
    fitEvaluation: 1,
  });

  assert.strictEqual(result.big, null);
});
test("着用感が矛盾するケースはcmに従って並び替え", () => {
  const testCmValue = 46;
  const pointKey = "shoulderWidth";
  const ownedClothes = [];
  ownedClothes.push({ name: "A", measurements: { [pointKey]: { cmValue: 44, fitEvaluation: 1 } } });
  ownedClothes.push({ name: "B", measurements: { [pointKey]: { cmValue: 48, fitEvaluation: 0 } } });
  const result = predict(testCmValue, ownedClothes, pointKey);

  assert.deepStrictEqual(result.small, {
    name: "A",
    cmValue: 44,
    fitEvaluation: 1,
  });

  assert.deepStrictEqual(result.big, {
    name: "B",
    cmValue: 48,
    fitEvaluation: 0,
  });
});
