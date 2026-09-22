# sresaksoftware.com

Site for **Sresak Software Solutions Pty Ltd** (Perth, WA · ABN 53 613 988 131 · ACN 613988131).

- Single-file static site (`index.html`, ~16KB, no framework, no build step)
- Hosted: GitHub Pages (`EthanX0904/sresaksoftware.com`) + Cloudflare DNS/HTTPS
- Lead source: `perth_leads/Perth_最终名单_AB已剔除_852家_20260922.csv`

## Before going live
Replace `[待确认]` in `index.html`:
- phone / email / business hours
- Formspree form id (`https://formspree.io/f/...`)

## Deploy
```
git init && git add -A && git commit -m "init sresaksoftware.com"
git branch -M main && git remote add origin git@github.com:EthanX0904/sresaksoftware.com.git
git push -u origin main     # then Settings → Pages → main / root
```
