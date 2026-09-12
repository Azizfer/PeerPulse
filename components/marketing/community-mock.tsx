import { Avatar } from "@/components/avatar"
import { Badge } from "@/components/ui/badge"
import { FileText, Heart, MessageSquare, Sparkles } from "lucide-react"

/** Static mock of the community feed + shared resource library. */
export function CommunityMock() {
  return (
    <div className="relative">
      <div className="glow-soft -left-8 -top-10 h-52 w-52 bg-apricot/40" />
      <div className="glow-soft -bottom-8 -right-6 h-48 w-48 bg-sky/50" />

      <div className="relative space-y-3">
        {/* Post */}
        <article className="rounded-3xl border border-line bg-surface p-5 shadow-card">
          <div className="flex items-start gap-3">
            <Avatar name="Sana Benali" size="md" status="online" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-sm font-bold text-ink">Sana Benali</p>
                <Badge variant="lilac">Statistics</Badge>
                <span className="text-[13px] text-ink-mute">2h</span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                Can someone explain the difference between Type I and Type II errors in a way
                that actually sticks? I keep mixing them up on practice exams.
              </p>
              <div className="mt-4 flex items-center gap-5 text-[13px] font-medium text-ink-mute">
                <span className="inline-flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" /> 14 replies
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Heart className="h-4 w-4" /> 32
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* Resource */}
        <article className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-4 shadow-card">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-apricot text-apricot-deep">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-bold text-ink">
              Hypothesis-testing-cheatsheet.pdf
            </p>
            <p className="text-[13px] text-ink-mute">Shared by Yassine · 240 downloads</p>
          </div>
          <span className="rounded-full bg-surface-sunken px-3 py-1.5 text-[12px] font-semibold text-ink-soft">
            Save
          </span>
        </article>

        {/* AI assist */}
        <article className="rounded-3xl border border-pulse/30 bg-pulse-soft/70 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pulse-dark" />
            <p className="font-display text-sm font-bold text-pulse-dark">Pulse answered it</p>
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-pulse-dark/90">
            “Type I = you cry wolf (false positive). Type II = you miss the wolf (false
            negative).” Saved 8 people an hour of Googling.
          </p>
        </article>
      </div>
    </div>
  )
}
