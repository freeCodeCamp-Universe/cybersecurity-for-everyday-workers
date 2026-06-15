# Cybersecurity for Everyday Workers

A static course site - ten modules, sixty short lessons. Part of the freeCodeCamp Universe platform.

## Run locally

This is a plain static site with no build step. Serve it with any local HTTP server.

**Using Python:**

```sh
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

**Using Node (`npx`):**

```sh
npx serve .
```

> Do not open `index.html` directly as a file (`file://`) - module scripts won't load correctly without an HTTP server.

## Project structure

```
index.html           - course home page
lesson/index.html    - lesson viewer
src/
  data/course.js     - course and module data
  features/          - page-specific JS modules
  styles/            - CSS (tokens, base, components)
content/modules/     - lesson content (m1-m10)
platform.yaml        - deployment config
```

## License

Copyright © 2014 [freeCodeCamp.org](http://freecodecamp.org/)
The content of this repository is bound by the following licenses:
- The computer software is licensed under the [BSD-3-Clause](https://github.com/freeCodeCamp/freeCodeCamp/blob/main/LICENSE.md) license.
- The curriculum content is copyright © 2014 [freeCodeCamp.org](http://freecodecamp.org/)
