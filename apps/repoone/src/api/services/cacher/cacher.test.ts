import * as Mx from "errable";
import { cacher } from "./cacher";
import { type t } from "opc-types/lib";
import { fill } from "../../../utils/Data/dataTransform/dataTransform";

describe("services/cacher", () => {
  const fixtureValueCached = 5;
  const fixtureValue = 4;

  let mockCacherBridge: t.CacherBridge;
  const fn = jest.fn();

  beforeEach(() => {
    mockCacherBridge = {
      read: jest
        .fn()
        .mockImplementation(() => Promise.resolve(fixtureValueCached)),
      save: jest.fn().mockImplementation(() => Promise.resolve(true)),
    };
    fn.mockClear();
    fn.mockImplementation(() => Promise.resolve(fixtureValue));
  });

  const baseParams: t.CacherParams<[number]> = {
    key: "test",
    expiry: Date.now() + 60,
    args: [2],
  };

  it("doesn't call cacher read if shouldUse returns false", async () => {
    const params: t.CacherParams<[number]> = fill(
      {
        shouldUse: () => false,
      },
      baseParams
    );

    const result = await cacher(params, fn, mockCacherBridge);

    expect(mockCacherBridge.read).not.toHaveBeenCalled();
    expect(result).toEqual(fixtureValue);
  });

  it("calls cacherBridge read in default case", async () => {
    const result: number = await cacher(baseParams, fn, mockCacherBridge);

    expect(mockCacherBridge.read).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`^${baseParams.key}.*?`))
    );
    expect(result).toEqual(fixtureValueCached);
  });

  it("doesn't call fn if read returns Some", async () => {
    const result: number = await cacher(baseParams, fn, mockCacherBridge);

    expect(fn).not.toHaveBeenCalled();
    expect(result).toEqual(fixtureValueCached);
  });

  it("calls cacherBridge save when read returns none", async () => {
    mockCacherBridge.read = jest
      .fn()
      .mockImplementationOnce(() => Mx.err(null));

    const result: number = await cacher(baseParams, fn, mockCacherBridge);

    expect(mockCacherBridge.save).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`^${baseParams.key}.*?`)),
      baseParams.expiry,
      fixtureValue
    );
    expect(fn).toHaveBeenCalled();
    expect(result).toEqual(fixtureValue);
  });

  it("doesn't call save if told not to", async () => {
    mockCacherBridge.read = jest
      .fn()
      .mockImplementationOnce(() => Mx.err(null));

    const params: t.CacherParams<[number]> = fill(
      {
        shouldSave: () => false,
      },
      baseParams
    );

    await cacher(params, fn, mockCacherBridge);

    expect(mockCacherBridge.save).not.toHaveBeenCalled();
    expect(fn).toHaveBeenCalled();
  });
});
