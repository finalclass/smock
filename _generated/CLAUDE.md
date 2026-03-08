# Smock — project instructions

## Build
- `dune build --display=verbose` — compiles everything (OCaml + TS → JS)

## Rules
- NEVER modify `.js` files directly — always edit the `.ts` source in `static/ts/`. The build compiles TS → JS automatically.
