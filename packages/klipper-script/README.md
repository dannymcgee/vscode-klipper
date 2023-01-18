# `klipper-script` Grammar

This project generates the TextMate grammar for the embedded `klipper-script`
language. In reality, what this extension calls `klipper-script` is a
combination of [Jinja2 templates](https://jinja.palletsprojects.com/en/2.10.x/templates/)
and Python, but I thought it simpler to bundle a single, compact grammar with
this extension for embedding than to depend on separate language extensions for
each of those.

Additionally, treating `klipper-script` as a holistic language for our purposes
leaves room to provide Klipper-specific intelligence (e.g., hover tooltips) for
those Jinja2/Python expressions without needing to, say, figure out how to tell
a Python language server to expect certain global variables to be present.
