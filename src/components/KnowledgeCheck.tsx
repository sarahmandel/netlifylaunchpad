import { useState } from 'react'
import { CircleCheck, X } from 'lucide-react'

type Question = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export function KnowledgeCheck({ questions, onPass, passed }: { questions: Question[]; onPass: () => void; passed: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const select = (q: number, a: number) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [q]: a }))
  }

  const submit = () => {
    setSubmitted(true)
    if (questions.every((q, i) => answers[i] === q.correctIndex)) {
      onPass()
    }
  }

  const allAnswered = Object.keys(answers).length === questions.length
  const allCorrect = submitted && questions.every((q, i) => answers[i] === q.correctIndex)

  if (passed) {
    return (
      <div className="rounded-lg border border-primary/30 bg-accent p-6 flex items-center gap-3">
        <CircleCheck className="h-6 w-6 text-primary shrink-0" />
        <div>
          <p className="font-semibold text-accent-foreground">Quiz Passed!</p>
          <p className="text-sm text-muted-foreground">You've successfully completed this knowledge check.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <CircleCheck className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Knowledge Check</h3>
      </div>
      {questions.map((q, qi) => (
        <div key={qi} className="rounded-lg border border-border bg-card p-5 space-y-3 animate-fade-in" style={{ animationDelay: `${qi * 100}ms` }}>
          <p className="font-medium text-card-foreground">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi
              const correct = q.correctIndex === oi
              let style = 'border border-border bg-secondary/50 hover:bg-secondary cursor-pointer'
              if (submitted) {
                if (correct) style = 'border border-primary bg-accent'
                else if (selected && !correct) style = 'border border-destructive bg-destructive/10'
              } else if (selected) {
                style = 'border border-primary bg-accent'
              }
              return (
                <button key={oi} onClick={() => select(qi, oi)} className={`w-full text-left rounded-md px-4 py-3 text-sm transition-all ${style}`}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + oi)}</span>
                    <span>{opt}</span>
                    {submitted && correct && <CircleCheck className="h-4 w-4 text-primary ml-auto shrink-0" />}
                    {submitted && selected && !correct && <X className="h-4 w-4 text-destructive ml-auto shrink-0" />}
                  </div>
                </button>
              )
            })}
          </div>
          {submitted && !allCorrect && answers[qi] !== q.correctIndex && (
            <p className="text-sm text-muted-foreground mt-2 pl-2 border-l-2 border-primary">{q.explanation}</p>
          )}
        </div>
      ))}
      {submitted ? (
        allCorrect ? null : (
          <button onClick={() => { setSubmitted(false); setAnswers({}) }} className="w-full py-2.5 rounded-lg border border-border font-semibold hover:bg-secondary transition-colors">
            Try Again
          </button>
        )
      ) : (
        <button onClick={submit} disabled={!allAnswered} className="w-full py-2.5 rounded-lg gradient-teal text-primary-foreground border-0 font-semibold disabled:opacity-50 transition-colors">
          Submit Answers
        </button>
      )}
    </div>
  )
}
