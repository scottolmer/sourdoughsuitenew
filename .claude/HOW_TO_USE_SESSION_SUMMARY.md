# How to Use the Session Summary Skill

## 🎯 Super Simple Usage

### Creating a Summary

**Just say any of these:**

```
Create a session summary
```

```
/session-summary
```

```
Generate a session summary for today's work
```

```
Emergency session summary
```

**That's it!** The skill will:
1. ✅ Analyze your git commits
2. ✅ Check what files changed
3. ✅ Run tests to verify state
4. ✅ Generate comprehensive summary
5. ✅ Save to `.claude/sessions/session-YYYY-MM-DD.md`
6. ✅ Update PROGRESS.md
7. ✅ Commit everything
8. ✅ Give you the resume instructions

---

## 🔄 Resuming Work

### After Restart / Next Day

**Copy/paste this to Claude Code:**

```
I'm resuming work after a restart.

Please read:
1. .claude/sessions/session-2026-02-02.md
2. PROGRESS.md

Then help me continue from where I left off.
```

**Claude will:**
- Read your session summary
- Understand all context
- Know exactly what you were doing
- Help you continue seamlessly

---

## 📁 Where Summaries Are Stored

All summaries are in:
```
.claude/sessions/
├── session-2026-02-01.md
├── session-2026-02-02.md  ← Today's summary
└── session-2026-02-03.md
```

**Benefits:**
- ✅ Always committed to git (never lost)
- ✅ Easy to find by date
- ✅ Can read in any text editor
- ✅ Full context for any day

---

## 💡 When to Create Summaries

### Recommended Times

**End of Day** (Most Important)
```
Before closing: "Create a session summary"
```

**Before Breaks**
```
Going to lunch: "Quick session summary"
```

**After Major Milestones**
```
Just finished feature: "Create a session summary"
```

**Before Context Switches**
```
Switching projects: "Create a session summary"
```

**Emergency Situations**
```
Windows update warning: "Emergency session summary"
```

---

## 🎯 What Gets Captured

Each summary includes:

### 1. Session Info
- Date and duration
- Main goals
- What was accomplished

### 2. Current State
- Files modified
- Tests passing?
- TypeScript compiling?
- Last commands run

### 3. Git Activity
- Recent commits
- Changed files
- Commit messages

### 4. Next Steps
- Immediate actions
- Short-term plans
- Long-term goals

### 5. Quick Resume
- Exact commands to run
- Files to read
- What to tell Claude

### 6. Important Context
- Key decisions made
- Patterns used
- Files to know about

---

## 📊 Example Summary Structure

```markdown
# Session Summary - 2026-02-02

## What Got Done
- [x] Task 1
- [x] Task 2

## Current State
- Files: 8 modified
- Tests: 68/68 passing ✅
- TypeScript: No errors ✅

## Next Steps
1. Commit everything
2. Test in app
3. Deploy

## Quick Resume
Commands to run:
git status
npm test

Tell Claude:
"Read session-2026-02-02.md and help me continue"
```

---

## 🚀 Example Workflow

### Perfect End-of-Day Routine

```bash
# 1. Commit any pending work
git add .
git commit -m "Complete feature X"

# 2. Tell Claude
"Create a session summary"

# 3. Done!
# Summary is created, saved, committed
# You can close laptop with confidence
```

### Perfect Start-of-Day Routine

```bash
# 1. Check what you worked on
cat .claude/sessions/session-2026-02-02.md

# 2. Tell Claude
"I'm resuming work. Please read session-2026-02-02.md and help me continue"

# 3. Start coding!
# Claude has full context, you're ready to go
```

---

## 💪 Pro Tips

### Tip 1: Create Before Breaks
**Even 5-minute breaks!**
```
"Quick session summary"
```
Takes 10 seconds, saves hours if system crashes.

### Tip 2: Reference Summaries
**In commit messages:**
```bash
git commit -m "See session-2026-02-02.md for full context"
```

### Tip 3: Share with Team
**Great for collaboration:**
```bash
# Share session summary in pull request
git push
# Reference: .claude/sessions/session-2026-02-02.md
```

### Tip 4: Review Weekly
**Every Friday:**
```bash
# See what you accomplished this week
ls .claude/sessions/session-2026-02-*.md
cat .claude/sessions/session-2026-02-*.md
```

---

## 🔧 Advanced Usage

### Multiple Summaries Per Day
The skill automatically handles multiple summaries:
- First: `session-2026-02-02.md`
- Second: `session-2026-02-02-1430.md` (2:30 PM)
- Third: `session-2026-02-02-1700.md` (5:00 PM)

### Compare Summaries
```
Compare my session summaries from yesterday and today
```

### Search Summaries
```
Search my session summaries for "refactoring"
```

---

## ❓ FAQ

**Q: How long does it take?**
A: 10-20 seconds to generate and commit

**Q: Does it work with uncommitted changes?**
A: Yes! It captures current state even with pending work

**Q: Can I edit the summary after creation?**
A: Yes! It's just a markdown file, edit freely and commit

**Q: What if I forget to create one?**
A: You can create one retroactively - it analyzes git history

**Q: Can I create summaries for past dates?**
A: Yes! Just say "Create a session summary for yesterday"

---

## ✅ Success Checklist

You're using it right if:

- ✅ Create summary at end of every work session
- ✅ Can resume work in < 5 minutes after restart
- ✅ Never confused about what you were doing
- ✅ Have clear record of all accomplishments
- ✅ Can explain work to others easily
- ✅ Feel confident closing laptop anytime

---

## 🎉 You're All Set!

### The Complete Workflow

**While Working:**
```
Every 30 min: Commit with good message
Every break: "Create a session summary"
End of day: "Create a session summary"
```

**When Resuming:**
```
Read: .claude/sessions/session-[DATE].md
Tell Claude: "Read session and help me continue"
```

**Result:**
- Never lose context
- Resume instantly
- Always know what's next
- Complete work history

---

## 🆘 Emergency Procedure

**Windows Update Warning / Unexpected Restart:**

```
# Say this to Claude IMMEDIATELY:
"Emergency session summary NOW"

# Claude will:
1. Capture current state in seconds
2. Save and commit
3. You're protected!
```

---

**Remember**: One command protects all your work!

Just say: **"Create a session summary"**

That's it! 🎯
