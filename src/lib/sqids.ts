import Sqids from "sqids";

const sqids = new Sqids({
  minLength: 6,
  alphabet: process.env.SQIDS_ALPHABET,
});

export const encodeId = (id: number) => sqids.encode([id]);
