# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.1](https://github.com/bericp1/aps-beam-notify/compare/v0.4.0...v0.4.1) (2022-02-07)

**Note:** Version bump only for package @aps-beam-notify/root

# [0.4.0](https://github.com/bericp1/aps-beam-notify/compare/v0.3.0...v0.4.0) (2022-02-07)

### Features

- **cli:** support multiple slack webhook urls ([36a04f2](https://github.com/bericp1/aps-beam-notify/commit/36a04f2cb6a04ba761ba3c637274cc012f6d2f5d))
- **core:** add the unchanged details to the slack webhook notification ([7ba7d63](https://github.com/bericp1/aps-beam-notify/commit/7ba7d63e3ff62a09a588e3476ae57481a0640769))

# [0.3.0](https://github.com/bericp1/aps-beam-notify/compare/v0.2.3...v0.3.0) (2022-02-07)

### Features

- **cli:** bring the CLI up to date with the core refactor and use the NotificationManager ([fbb1bb1](https://github.com/bericp1/aps-beam-notify/commit/fbb1bb14d462600b47124b8c154a4bbdb5792208))
- **core:** full breaking refactor of core to support watching all APS Beam details ([56ddef3](https://github.com/bericp1/aps-beam-notify/commit/56ddef3bf6159bf26650e77258fa91f6762e9d50))

### BREAKING CHANGES

- **cli:** the notifications that the CLI sends are way different now, richer
- **core:** The vast majority of the public API changed as part of this refactor.

## [0.2.3](https://github.com/bericp1/aps-beam-notify/compare/v0.2.2...v0.2.3) (2022-02-06)

### Bug Fixes

- **cli:** ensure CLI bin actually works ([f089ec3](https://github.com/bericp1/aps-beam-notify/commit/f089ec34021b14a166f02ba57cd81ef0fdde8f1b))

## [0.2.2](https://github.com/bericp1/aps-beam-notify/compare/v0.2.1...v0.2.2) (2022-02-06)

**Note:** Version bump only for package @aps-beam-notify/root

## [0.2.1](https://github.com/bericp1/aps-beam-notify/compare/v0.2.0...v0.2.1) (2022-02-06)

Version bump for testing.

# [0.2.0](https://github.com/bericp1/aps-beam-notify/compare/17d2bcd0b2c3d02dafdc43c8b11c2cc2ee132244...v0.2.0) (2022-02-06)

### Bug Fixes

- **dev:** better ignore files for prettier and eslint ([73d88ab](https://github.com/bericp1/aps-beam-notify/commit/73d88abdf03c8115b9470721995d72febdfdbcc3))
- update packages that are scoped to be publishable ([364c07d](https://github.com/bericp1/aps-beam-notify/commit/364c07df2a83493be61f13321e3b579abbca82de))

### Features

- **dev:** add eslint ([7e577ef](https://github.com/bericp1/aps-beam-notify/commit/7e577eff69935c0f96d8a334d313aaa1dd28798f))
- **dev:** add husky and lint-staged ([fa741c4](https://github.com/bericp1/aps-beam-notify/commit/fa741c41cde5a9466b32d072927c0662f9f5c517))
- initial functionial implementation of core + cli ([411bb01](https://github.com/bericp1/aps-beam-notify/commit/411bb0157a581f9069619a0b507a942a5b283052))
- initial setup of monorepo ([17d2bcd](https://github.com/bericp1/aps-beam-notify/commit/17d2bcd0b2c3d02dafdc43c8b11c2cc2ee132244))
- remove errant tsconfig exclude and introduce clean commands ([822eb5d](https://github.com/bericp1/aps-beam-notify/commit/822eb5db523acb12291572d16c1ef4be4d961123))
