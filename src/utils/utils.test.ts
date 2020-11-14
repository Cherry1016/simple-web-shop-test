import { checkQuantity } from "./index";

describe("checkQuantity, assume stock is always > 0", () => {
  test("min 0 max 0 --> value / stock", () => {
    expect(checkQuantity({ value: 1, minQty: 0, maxQty: 0, stock: 10 })).toBe(1)
    expect(checkQuantity({ value: 10, minQty: 0, maxQty: 0, stock: 10 })).toBe(10)
    expect(checkQuantity({ value: 11, minQty: 0, maxQty: 0, stock: 10 })).toBe(10)
  })
  test("value less than min --> min / stock", () => {
    expect(checkQuantity({ value: 1, minQty: 2, maxQty: 0, stock: 10 })).toBe(2)
    expect(checkQuantity({ value: 0, minQty: 1, maxQty: 0, stock: 10 })).toBe(1)
    expect(checkQuantity({ value: 2, minQty: 3, maxQty: 0, stock: 1 })).toBe(1)
  })
  test("value greater than max --> max / stock ", () => {
    expect(checkQuantity({ value: 12, minQty: 2, maxQty: 11, stock: 15 })).toBe(11)
    expect(checkQuantity({ value: 12, minQty: 2, maxQty: 15, stock: 11 })).toBe(11)
  })
})