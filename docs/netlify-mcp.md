# Netlify MCP

The Netlify MCP server gives an AI agent first-class access to this project on
Netlify — listing and inspecting projects, reading deploy and build logs,
managing environment variables, and running the deploy workflows the Netlify CLI
exposes — instead of you copying output back and forth by hand.

This repository ships a committed `.mcp.json` at the root, so any agent that
reads project-scoped MCP config (Claude Code, and others that follow the same
convention) picks the server up automatically when it opens this repo. Everything
below is either confirmation of that or setup for clients that keep MCP config
outside the project.

## Server

| | |
|---|---|
| Remote server (recommended) | `https://netlify-mcp.netlify.app/mcp` |
| Local server | `npx -y @netlify/mcp` |

Netlify recommends the remote server: it always exposes the current set of
capabilities, with nothing to keep updated locally. Use the local server only if
your environment forbids remote MCP servers.

## Setup

### 1. Already configured (project-scoped clients)

Open this repo and approve the `netlify` server when your agent prompts you.
Nothing else to do — `.mcp.json` is the configuration.

### 2. Add it to another client

The universal installer prompts you for which agents to configure:

```bash
npx -y add-mcp https://netlify-mcp.netlify.app/mcp
```

For the local server instead:

```bash
npx -y add-mcp "npx -y @netlify/mcp"
```

Or write the config by hand, in whatever file your client uses:

```json
{
  "mcpServers": {
    "netlify": {
      "url": "https://netlify-mcp.netlify.app/mcp"
    }
  }
}
```

Cursor, VS Code, and LM Studio also have one-click install links on the
[Netlify MCP server docs page](https://docs.netlify.com/build/build-with-ai/netlify-mcp-server/).
Claude Desktop, Claude web, and ChatGPT connect through the Netlify connector /
app in their own settings rather than through a config file.

### 3. Authenticate

The remote server authorizes on the first tool call: hosted clients open an
OAuth-style connector flow, and CLI-based clients reuse the session from
`netlify login`. There is no token to add to `.mcp.json`, and no Netlify
credential belongs in this repository or in the project's environment variables.

### 4. Verify

Ask your agent to list your Netlify projects. It should return
`netlifylaunchpad` — this project. If it returns nothing, you are authenticated
against a different Netlify account or team.

## Optional: Netlify agent skills

MCP gives an agent the tools; the agent skills give it Netlify's guidance on how
to use them.

```bash
npx skills add netlify/context-and-tools --skill '*' --yes
```

Netlify Agent Runners already apply these skills automatically, so this is only
worth doing for your local editor.
