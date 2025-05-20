import { readFileSync } from "fs";
import path from "path";
import { parseWall } from "./../../utils/parseWall";
import House from "./../../classes/House";

enum HousePaths {
  HOUSE1 = "../mock-data/house1/mock-house.json",
  ANSWER1 = "../mock-data/house1/mock-answer.json",
  HOUSE2 = "../mock-data/house2/mock-house.json",
  ANSWER2 = "../mock-data/house2/mock-answer.json",
  HOUSE3 = "../mock-data/house3/mock-house.json",
  ANSWER3 = "../mock-data/house3/mock-answer.json",
  HOUSE4 = "../mock-data/house4/mock-house.json",
  ANSWER4 = "../mock-data/house4/mock-answer.json",
  HOUSE5 = "../mock-data/house5/mock-house.json",
  ANSWER5 = "../mock-data/house5/mock-answer.json",
  HOUSE6 = "../mock-data/house6/mock-house.json",
  ANSWER6 = "../mock-data/house6/mock-answer.json",
  HOUSE7 = "../mock-data/house7/mock-house.json",
  ANSWER7 = "../mock-data/house7/mock-answer.json",
  HOUSE8 = "../mock-data/house8/mock-house.json",
  ANSWER8 = "../mock-data/house8/mock-answer.json",
  HOUSE9 = "../mock-data/house9/mock-house.json",
  ANSWER9 = "../mock-data/house9/mock-answer.json",
  HOUSE10 = "../mock-data/house10/mock-house.json",
  ANSWER10 = "../mock-data/house10/mock-answer.json",
  HOUSE11 = "../mock-data/house11/mock-house.json",
  ANSWER11 = "../mock-data/house11/mock-answer.json",
  HOUSE12 = "../mock-data/house12/mock-house.json",
  ANSWER12 = "../mock-data/house12/mock-answer.json",
  HOUSE13 = "../mock-data/house13/mock-house.json",
  ANSWER13 = "../mock-data/house13/mock-answer.json",
}

function readJsonFile(filePath: string): any {
  return JSON.parse(readFileSync(path.join(__dirname, filePath), "utf-8"));
}

describe("Calculate house", () => {
  test("should correctly calculate house #1", () => {
    const jsonHouse = readJsonFile(HousePaths.HOUSE1);
    const answer = readJsonFile(HousePaths.ANSWER1);
    const walls = jsonHouse.walls.map(parseWall);
    const house = new House(walls);
    expect(house.computeHouse()).toEqual(answer);
  });

  test("should correctly calculate house #2", () => {
    const jsonHouse = readJsonFile(HousePaths.HOUSE2);
    const answer = readJsonFile(HousePaths.ANSWER2);
    const walls = jsonHouse.walls.map(parseWall);
    const house = new House(walls);
    expect(house.computeHouse()).toEqual(answer);
  });

  test("should correctly calculate house #3 (2 floors)", () => {
    const jsonHouse = readJsonFile(HousePaths.HOUSE3);
    const answer = readJsonFile(HousePaths.ANSWER3);
    const walls = jsonHouse.walls.map(parseWall);
    const house = new House(walls);
    expect(house.computeHouse()).toEqual(answer);
  });

  test("should correctly calculate house #4 (2 floors and rebars specs change)", () => {
    const jsonHouse = readJsonFile(HousePaths.HOUSE4);
    const answer = readJsonFile(HousePaths.ANSWER4);
    const walls = jsonHouse.walls.map(parseWall);
    const house = new House(walls);
    expect(house.computeHouse()).toEqual(answer);
  });

  // test("should correctly calculate house #5 (double taper top and brickledge)", () => {
  //   const jsonHouse = readJsonFile(HousePaths.HOUSE5);
  //   const answer = readJsonFile(HousePaths.ANSWER5);
  //   const walls = jsonHouse.walls.map(parseWall);
  //   const house = new House(walls);
  //   expect(house.computeHouse()).toEqual(answer);
  // });

  test("should correctly calculate house #6 (double taper top and brickledge)", () => {
    const jsonHouse = readJsonFile(HousePaths.HOUSE6);
    const answer = readJsonFile(HousePaths.ANSWER6);
    const walls = jsonHouse.walls.map(parseWall);
    const house = new House(walls);
    expect(house.computeHouse()).toEqual(answer);
  });

  test("should correctly calculate house #7 (pinion and double taper top and brickledge)", () => {
    const jsonHouse = readJsonFile(HousePaths.HOUSE7);
    const answer = readJsonFile(HousePaths.ANSWER7);
    const walls = jsonHouse.walls.map(parseWall);
    const house = new House(walls);
    expect(house.computeHouse()).toEqual(answer);
  });

  test("should correctly calculate house #8 (knock down)", () => {
    const jsonHouse = readJsonFile(HousePaths.HOUSE8);
    const answer = readJsonFile(HousePaths.ANSWER8);
    const walls = jsonHouse.walls.map(parseWall);
    const house = new House(walls);
    expect(house.computeHouse()).toEqual(answer);
  });

  // test("should correctly calculate house #9 (knock down and brickledge and taper)", () => {
  //   const jsonHouse = readJsonFile(HousePaths.HOUSE9);
  //   const answer = readJsonFile(HousePaths.ANSWER9);
  //   const walls = jsonHouse.walls.map(parseWall);
  //   const house = new House(walls);
  //   expect(house.computeHouse()).toEqual(answer);
  // });

  test("should correctly calculate house #9 simple 1 floor", () => {
    const jsonHouse = readJsonFile(HousePaths.HOUSE9);
    const answer = readJsonFile(HousePaths.ANSWER9);
    const walls = jsonHouse.walls.map(parseWall);
    const house = new House(walls);
    expect(house.computeHouse()).toEqual(answer);
  });

  test("should correctly calculate house #10 brickledge with windows", () => {
    const jsonHouse = readJsonFile(HousePaths.HOUSE10);
    const answer = readJsonFile(HousePaths.ANSWER10);
    const walls = jsonHouse.walls.map(parseWall);
    const house = new House(walls);
    expect(house.computeHouse()).toEqual(answer);
  });

  test("should correctly calculate house #11 brickledge with windows and taper top", () => {
    const jsonHouse = readJsonFile(HousePaths.HOUSE11);
    const answer = readJsonFile(HousePaths.ANSWER11);
    const walls = jsonHouse.walls.map(parseWall);
    const house = new House(walls);
    expect(house.computeHouse()).toEqual(answer);
  });

  test("should correctly calculate house #12 real life house", () => {
    const jsonHouse = readJsonFile(HousePaths.HOUSE12);
    const answer = readJsonFile(HousePaths.ANSWER12);
    const walls = jsonHouse.walls.map(parseWall);
    const house = new House(walls);
    expect(house.computeHouse()).toEqual(answer);
  });

  test("should correctly calculate house #13 real life house with brick ledge and taper top and added 45 corners", () => {
    const jsonHouse = readJsonFile(HousePaths.HOUSE13);
    const answer = readJsonFile(HousePaths.ANSWER13);
    const walls = jsonHouse.walls.map(parseWall);
    const house = new House(walls);
    expect(house.computeHouse()).toEqual(answer);
  });
});
