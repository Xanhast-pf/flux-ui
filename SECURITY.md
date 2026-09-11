# Security policy

Flux UI is an alpha project. Security checks reduce specific risks; they are not
an independent audit, certification, guarantee of safety, or promise that every
vulnerability is detected.

## Reporting a vulnerability

Please do not disclose exploit details, secrets, or personal data in a public
issue. Use [GitHub private vulnerability reporting](https://github.com/Xanhast-pf/flux-ui/security/advisories/new)
when it is enabled. Include the affected package/version, impact, reproduction,
and a minimal proof of concept that does not expose other people's data.

If private reporting is unavailable, open a public issue containing **only a
request for a private security contact**, without vulnerability details. Wait
for a private channel before sharing the report. No private email address is
advertised until a maintainer has confirmed and monitors it.

The maintainer will assess reports on a best-effort basis. There is no guaranteed
response or fix deadline. Coordinate publication with the maintainer; confirm a
fix and an appropriate disclosure date rather than assuming silence means a fix.

## Supported versions

Security maintenance targets the latest released alpha (or latest stable release
once one exists). Older versions do not have a promised backport policy. Check
published advisories and release notes before adopting or upgrading.

## Security boundaries

Flux components are UI primitives, not sanitizers or authorization controls.
Applications own their authentication, authorization, URL validation, untrusted
HTML handling, server input validation and deployment security. Do not pass
untrusted HTML to rendering escape hatches or treat disabled controls as access
control.

The documentation Stress Lab accepts only bounded built-in scenarios. Its
same-origin render frames run trusted project code; they are not sandboxes for
untrusted submissions. Local benchmark and axe reports are not uploaded. Exported
reports contain environment and DOM diagnostic information: review them before
sharing. The Trust Center loads static same-origin CI evidence and links to
external verification services.

## Maintainer controls

See [trust setup](docs/trust/SETUP.md) for branch/environment protection, advanced
CodeQL setup, dependency scanning, OIDC publishing and attestation verification.
Repository settings and external account enrollment require an owner; workflow
files alone do not activate or certify those settings.
