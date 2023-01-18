# VS Code Klipper Support

This repo is an [Nx](https://nx.dev)-managed workspace.

Various parts of the extension are managed through individual projects located
under `/packages/`:

- `klipper`: The primary extension project, where the extension's `package.json`
	and TypeScript source code are located.
- `klipper-cfg`: The TextMate grammar for Klipper config files.
- `klipper-gcode`: The TextMate grammar for Klipper-flavored GCode.
- `klipper-script`: The TextMate grammar for interpolated Jinja2/Python
	expressions embedded within Jinja2 template tags.

The main workspace configuration is at `/nx.json`, while individual project
configurations can be found at `/packages/<project-name>/project.json`.

Most tasks for building, testing, packaging and publishing are handled through
the Nx CLI:

```sh
# Build, package, and locally install the extension
nx build klipper

# Build without local package & install
nx build klipper --package false --install false

# Build a specific grammar
nx build klipper-cfg
# Note: Dependencies are mapped, changes are tracked, and build results are
# cached, so generally you should just run `nx build klipper` instead.
```

More information for specific projects can generally be found under the
project-level README.
