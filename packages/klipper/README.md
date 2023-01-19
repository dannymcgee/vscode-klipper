# VS Code Klipper Support

Rich language support for Klipper configuration files and Klipper-flavored
GCode.

## Status

This extension is an early preview, with many features tentatively planned but
few implemented currently (see the roadmap below for details). It's under active
development at the time of writing, as I'm using it to manage my Klipper
printer(s), but this is subject to change. If you aren't happy with it in its
current state, don't assume that it will improve &mdash; but do feel free to
open issues, feature requests, pull requests, or fork it and make it your own.

## Roadmap

### Syntax Highlighting
- [x] Base config syntax
- [x] Klipper-flavored GCode syntax
- [x] Jinja2 template expressions

### Language Configuration
- [x] Base config syntax
- [x] Klipper-flavored GCode

### Programmatic Language Features
- [ ] Document symbols
- [ ] Hover tooltips
  - [ ] Klipper built-ins
  - [ ] User-defined symbols
- [ ] Intelligent symbol references/linking
  - [ ] Go to definition
  - [ ] Renaming
- [ ] Diagnostics
- [ ] Completion suggestions
  - [ ] Klipper built-ins
  - [ ] User-defined symbols
