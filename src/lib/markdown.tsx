import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

// Minimal markdown rendering for assistant answers.
//
// The assistants are prompted to reply with links, bold, inline code, and
// bullets and nothing else, so a full markdown library would be far more than
// this needs. Shared by the docs assistant and the home page assistant.

// Link targets are either an absolute documentation URL or an in-app path — the
// home page assistant cites the pages it retrieved from, and those are relative.
const INLINE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)|\*\*([^*]+)\*\*|`([^`]+)`/g

const LINK_CLASS = 'text-primary underline underline-offset-2 hover:text-primary/80 break-words'

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let key = 0
  let match: RegExpExecArray | null

  INLINE.lastIndex = 0
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    if (match[2]) {
      const href = match[2]
      if (href.startsWith('/')) {
        // Client-side navigation, so citing an in-app page does not reload the
        // app. The hash has to travel as its own prop — routes read it off the
        // router location to flash the item that was cited, and it never gets
        // there if it is left inside `to`.
        const [path, hash] = href.split('#')
        nodes.push(
          <Link key={key++} to={path} hash={hash} className={LINK_CLASS}>
            {match[1]}
          </Link>,
        )
      } else {
        nodes.push(
          <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            {match[1]}
          </a>,
        )
      }
    } else if (match[3]) {
      nodes.push(
        <strong key={key++} className="font-semibold text-foreground">
          {match[3]}
        </strong>,
      )
    } else if (match[4]) {
      nodes.push(
        <code key={key++} className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
          {match[4]}
        </code>,
      )
    }
    last = INLINE.lastIndex
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/** Minimal markdown: paragraphs, bullet lists, links, bold, inline code. */
export function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = []
  const lines = text.split('\n')
  let bullets: string[] = []
  let paragraph: string[] = []
  let key = 0

  const flushBullets = () => {
    if (bullets.length === 0) return
    blocks.push(
      <ul key={key++} className="list-disc pl-4 space-y-1">
        {bullets.map((b, i) => (
          <li key={i}>{renderInline(b)}</li>
        ))}
      </ul>,
    )
    bullets = []
  }

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    blocks.push(<p key={key++}>{renderInline(paragraph.join(' '))}</p>)
    paragraph = []
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      flushParagraph()
      flushBullets()
      continue
    }
    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph()
      bullets.push(trimmed.replace(/^[-*]\s+/, ''))
      continue
    }
    flushBullets()
    paragraph.push(trimmed.replace(/^#+\s*/, ''))
  }
  flushParagraph()
  flushBullets()

  return <div className="space-y-2">{blocks}</div>
}
