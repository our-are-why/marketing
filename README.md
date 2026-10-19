# marketing

Everything public-facing about our.are.why

- `website/`: the site at [our.are.why.soy](https://our.are.why.soy). The
  landing page is at `/`, the art and poems at `/art/`, and the resume at
  `/resume/`.
- `card/`: the MOO business card, as print-ready PDFs. Its logo, the
  landing page's art, and its fonts are read from `assets/`.
- `assets/`: the originals that the landing page's video, icons and link
  preview, the site's fonts, and the business card's logo and fonts are
  made from. Not published.

The site's URLs:

| URL                          | What                                          |
|------------------------------|-----------------------------------------------|
| `/`                          | the landing page                              |
| `/art/`                      | the art and poems                             |
| `/resume/`                   | the resume                                    |
| `/assets/resume.pdf`         | the resume's pdf, made by the build           |
| `/assets/resume.social.png`  | the resume's link preview, made by the build  |
| `/assets/art/`               | the art's images, at three widths             |
| `/assets/originals/`         | the art's full-size originals                 |
| `/assets/css/`, `/assets/fonts/` | a stylesheet per page, and fonts          |

## Preview locally

On the host, build and start the development container (it needs the shared
base image; see `../.apple-container/README.md`):

    ./.environment/scripts/buildContainer.sh
    ./.environment/scripts/startContainer.sh

Open code-server at http://localhost:8084 and, in its terminal, run:

    cd ~/project/website
    deno task build
    deno task startServer

The site is then at http://localhost:3003. `deno task buildWebsite` alone
skips the resume's pdf and link preview, and it's quicker.

## Remake media

These run in `website/`. The results are committed, so a normal build
doesn't need them.

    deno task buildArtImages   # the art's images, from public/assets/originals (~1 min)
    deno task encodeVideo      # the landing page's video and poster
    deno task makeImages       # the icons and the landing page's link preview
    deno task makeFonts        # the site's fonts, from assets/fonts

## Publish

    cd ~/project/website
    deno task deploy

This builds the site and uploads `build/` to the Cloudflare Pages project
`our-are-why`; the first deploy creates the project. Then attach
`our.are.why.soy` to it in the Cloudflare dashboard, under the project's
Custom domains.

## The business card

    cd ~/project/card
    deno run --allow-read --allow-write scripts/buildCard.ts

The PDFs land in `card/out/`. `scripts/buildCard.ts` describes each
one.
