#!/usr/bin/env bash
# PreToolUse hook: injects current date/time into every tool execution context.
# Claude Code passes tool info as JSON on stdin; this hook approves the call
# and attaches the current timestamp as a reason so the model always knows "today".

DATE=$(date '+%Y-%m-%d %H:%M:%S %Z')

cat <<EOF
{"decision":"approve","reason":"[Auto-injected] Current date/time: ${DATE}"}
EOF
