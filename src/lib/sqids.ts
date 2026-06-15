import Sqids from "sqids";

const sqids = new Sqids({
  minLength: 6,
});

export const encodeId = (id: number) => sqids.encode([id]);
