# `aps-beam-notify`

A monorepo containing packages that automate monitoring of the Argonne National Lab
APS beam status.

The tooling depends on scraping the following public website:

https://www3.aps.anl.gov/aod/blops/status/srStatus.html

You may also be looking for the legacy version of this, which was a simple script:

https://github.com/bericp1/aps-beam-notify-legacy

## Quick start

**Note:** Soon, this will be published as an npm package and you'll be able to simply run `npx aps-beam-notify`!

To run the command line tool that simply monitors the beam status and sends slack notifications
when it changes:

- Install Node >=15
- Install lerna using `npm install -g lerna`
- Run `yarn` to install dependencies
- Run `lerna build` to build the packages
- Run `export SLACK_WEBHOOK_URL="your-url-here"` (replacing "your-url-here" with your Slack Incoming Webhook URL)
- Run `node ./packages/cli/dist/index.js`

You'll see something like the following:

![](https://d.pr/i/rOKGTu.png)

![](https://d.pr/i/2eUVJk.png)
