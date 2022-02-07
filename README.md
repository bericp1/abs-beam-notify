# `aps-beam-notify`

A monorepo containing packages that automate monitoring of the Argonne National Lab
APS beam status.

The tooling depends on scraping the following public website:

https://www3.aps.anl.gov/aod/blops/status/srStatus.html

You may also be looking for the legacy version of this, which was a simple script:

https://github.com/bericp1/aps-beam-notify-legacy

## Quick start w/ the CLI

Ensure you have [Node >=15 installed](https://nodejs.org/en/download/) and then simply run:

```bash
export SLACK_WEBHOOK_URL="your-slack-webhook-url" # Replace your-slack-webhook-url appropriately
npx --package=@aps-beam-notify/cli@latest aps-beam-notify
```

You'll see something like the following:

![](https://d.pr/i/rOKGTu.png)

![](https://d.pr/i/2eUVJk.png)
