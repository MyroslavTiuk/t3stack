// todo: remove monet

import { extractSingleValues, extractRepeatingValues } from "./strings";
import { type t } from "opc-types/lib";
import { Map } from "immutable";

describe("utils/strings", () => {
  describe("extractSingleValues", () => {
    test("extracts single values", () => {
      const source = `<body>
  <div class='price'>$15.00</div><div class='other'>$40</div>
  <div class='volume'>50</div>
      </body>`;

      const matches: t.Optional<Map<string, string[]>> = extractSingleValues(
        source,
        Map({
          price: /class='price'>\$(.*?)</g,
          volume: /class='volume'>(.*?)</g,
        })
      );

      expect(matches !== undefined).toBe(true);
      expect((<Map<string, string[]>>matches).get("price")).toEqual(["15.00"]);
      expect((<Map<string, string[]>>matches).get("volume")).toEqual(["50"]);
    });

    test("none on fail due to too many matches", () => {
      const source = `<body>
  <div class='price'>$15.00</div><div class='other'>$40</div>
  <div class='price'>$16.00</div><div class='volume'>50</div>
      </body>`;

      const matches: t.Optional<Map<string, string[]>> = extractSingleValues(
        source,
        Map({
          price: /class='price'>\$(.*?)</g,
          volume: /class='volume'>(.*?)</g,
        })
      );

      expect(matches !== undefined).toBe(false);
    });

    test("none on fail due to not a match", () => {
      const source = `<body>
  <div class='prince'>$15.00</div><div class='other'>$40</div>
  <div class='volume'>50</div>
      </body>`;

      const matches: t.Optional<Map<string, string[]>> = extractSingleValues(
        source,
        Map({
          price: /class='price'>\$(.*?)</g,
          volume: /class='volume'>(.*?)</g,
        })
      );

      expect(matches !== undefined).toBe(false);
    });
  });

  describe("extractRepeatingValues", () => {
    const source = `<select name="ctl00$ContentTop$C002$ddlMonth" id="ContentTop_C002_ddlMonth">
      <option selected="selected" value="201811">2018 November</option>
      <option value="201812">2018 December</option>
      <option value="201901">2019 January</option>
      <option value="201902">2019 February</option>
      <option value="201904">2019 April</option>
      <option value="201906">2019 June</option>
      <option value="202001">2020 January</option>
      <option value="202006">2020 June</option>
      <option value="202101">2021 January</option>
    </select>`;

    test("extracts repeated values", () => {
      const matches: t.Optional<Map<string, string[][]>> =
        extractRepeatingValues(
          source,
          Map({
            date: /<option .*?value="(.*?)">(.*?)<\/option>/g,
          })
        );

      expect(matches !== undefined).toBe(true);
      // @ts-ignore
      expect(matches.get("date").length).toBe(9);
      // @ts-ignore
      expect(matches.get("date")[2]).toEqual(["201901", "2019 January"]);
    });

    test("left on fail due to missing match", () => {
      const matches: t.Optional<Map<string, string[][]>> =
        extractRepeatingValues(
          source,
          Map({
            date: /<option .*?value="(.*?)">(.*?)<\/option>/g,
            price: /class='price'>\$(.*?)</g,
          })
        );

      expect(matches !== undefined).toBe(false);
    });
  });
});
