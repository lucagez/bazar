# MESSAGES FOR MY FUTURE SELF

A `bazar` scoped store variable is apparently working way better compared to a `window` scoped one.
When developing locally you encounter way fewer bugs when updating files.

# TODO

- [x] Update the codepen demo to work according to the new API specs.
- [ ] ADD feature => destroy `bazar`.
- [ ] More reliable `poke` => allow poke only from registered components??
- [ ] Investigate possible drawbacks of using a global store like this.
- [ ] use `new Set()` from interests instead of `[...interests]` => Set.has() is O(1) vs .indexOf which is O(n).
- [ ] More extensive tests
  - [ ] Register ID test => Should test without using `getState`.
  - [ ] Register IDs test => Should test without using `getState`.
  - [ ] onEdict test => Should test without writing on `window.test`. 