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
    const jsonHouse = readJsonFile(HousePaths.HOUSE3);
    const answer = readJsonFile(HousePaths.ANSWER3);
    const walls = jsonHouse.walls.map(parseWall);
    const house = new House(walls);
    expect(house.computeHouse()).toEqual(answer);
  });
});
