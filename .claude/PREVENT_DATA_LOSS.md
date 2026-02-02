# Preventing Data Loss in Claude Code

Guide to preserving work and context when using Claude Code IDE without persistent memory.

---

## 🚨 The Problem

- Claude Code doesn't have persistent memory between sessions
- Windows updates can force restart without warning
- Lost context means lost productivity

---

## ✅ Solutions (Use Multiple!)

### 1. **Frequent Git Commits** ⭐ BEST
Commit early and often with detailed messages.

```bash
# After any significant progress
git add .
git commit -m "Descriptive message with context

- What was done
- Why it was done
- What's next"

# Even for WIP (work in progress)
git commit -m "WIP: Feature X (50% complete)

Current state:
- Part A done
- Part B in progress
- TODO: Part C and D"
```

**Benefits:**
- Complete snapshot of code
- Can resume exactly where you left off
- Commit messages provide context
- Can revert if needed

---

### 2. **PROGRESS.md File** ⭐ ESSENTIAL
Keep a running log updated throughout the day.

**Location**: `PROGRESS.md` in project root

**Update it:**
- ✅ When starting a task
- ✅ When completing a task
- ✅ When switching tasks
- ✅ Before taking a break
- ✅ When encountering issues

**Example structure**:
```markdown
## Current Status
- [x] Completed: Task A
- [ ] In Progress: Task B (50% done)
- [ ] Next: Task C

## Context for Next Session
- Working on Feature X
- Files modified: list.tsx, detail.tsx
- Next step: Add validation logic
```

---

### 3. **Session Summaries** ⭐ RECOMMENDED
Create a summary file at the end of each work session.

**Template**: `.claude/SESSION_TEMPLATE.md`

**Quick summary before closing**:
```bash
# Create dated summary
cp .claude/SESSION_TEMPLATE.md .claude/session-2026-02-02.md
# Edit it with today's work
```

---

### 4. **Claude Code Transcripts** (Automatic Backup)
Claude Code automatically saves conversation transcripts!

**Location**: `C:\Users\scott\.claude\projects\<project-hash>\<session-id>.jsonl`

**How to use**:
- Transcripts contain full conversation
- Can read them to remember context
- Backup of what was discussed

**Find your transcripts**:
```bash
# Current project transcripts
ls ~/.claude/projects/c--Users-scott-Desktop-SourdoughSuiteNew/
```

---

### 5. **Documentation Files** (Context Preservation)
Create markdown files to capture:
- Architecture decisions
- Implementation details
- Patterns used
- Next steps

**Examples from this project**:
- `IMPLEMENTATION_SUMMARY.md` - Skills implementation
- `REFACTORING_RESULTS.md` - Calculator refactoring
- `ALL_CALCULATORS_REFACTORED.md` - Complete refactoring summary

---

### 6. **Task Tracking** (Built-in)
Use Claude Code's task system:

```
# In Claude Code
/tasks - View all tasks
```

**Benefits:**
- Tracks what's done/pending
- Provides structure
- Easy to resume

---

### 7. **Windows Update Settings** (Prevention)
Configure Windows to prevent automatic restarts.

**Option A: Active Hours**
1. Settings → Windows Update → Advanced options
2. Set "Active hours" to your typical work times
3. Windows won't restart during active hours

**Option B: Pause Updates**
1. Settings → Windows Update
2. "Pause updates" for up to 5 weeks
3. Resume when convenient

**Option C: Group Policy (Windows Pro)**
1. Run `gpedit.msc`
2. Computer Configuration → Administrative Templates → Windows Components → Windows Update
3. Enable "Configure Automatic Updates"
4. Select "4 - Auto download and schedule install"
5. Set specific time (e.g., 3 AM)

**Option D: Notification Settings**
1. Settings → Windows Update → Advanced options
2. Enable "Show a notification when my PC requires a restart"
3. Gives you warning before restart

---

## 🔄 Workflow: Save Context Frequently

### Every 15-30 Minutes
```bash
# Quick commit
git add .
git commit -m "Progress on Feature X

- Did thing A
- Did thing B
- Next: thing C"
```

### Before Breaks
```bash
# Commit + update PROGRESS.md
git add .
git commit -m "WIP: Feature X (break point)"

# Update PROGRESS.md with current state
# - What's done
# - What's in progress
# - What's next
```

### End of Session
```bash
# Final commit
git add .
git commit -m "Session complete: Feature X

Completed:
- Task A
- Task B

Next session:
- Start with Task C
- Need to test D"

# Create session summary
cp .claude/SESSION_TEMPLATE.md .claude/session-$(date +%Y-%m-%d).md
# Edit the summary file
```

---

## 🎯 Quick Resume Strategy

When starting a new session after unexpected shutdown:

### Step 1: Check Git Status
```bash
git status  # What's uncommitted?
git log --oneline -10  # Recent commits
git diff  # What changed?
```

### Step 2: Read PROGRESS.md
```bash
cat PROGRESS.md  # What was I working on?
```

### Step 3: Check Task List
```
# In Claude Code
/tasks
```

### Step 4: Review Documentation
```bash
# Check recent docs
ls -lt *.md | head -5

# Read relevant files
cat IMPLEMENTATION_SUMMARY.md
cat REFACTORING_RESULTS.md
```

### Step 5: Tell Claude
In Claude Code, say:
```
I'm resuming work after a restart. Please read:
1. PROGRESS.md - for current status
2. Git log - for recent commits
3. ALL_CALCULATORS_REFACTORED.md - for context

Then help me continue where I left off.
```

---

## 📝 Template: Starting a New Session

**Copy/paste this to Claude Code when resuming:**

```
I'm resuming work on the SourdoughSuite project after a shutdown.

Context files to read:
- PROGRESS.md (current status)
- [Most recent documentation file]

Recent commits:
[Paste output of: git log --oneline -5]

Current state:
- Files uncommitted: [from git status]
- Last task: [from PROGRESS.md]
- Next step: [from PROGRESS.md]

Please help me continue from here.
```

---

## 🛠️ Setup: First Time

Run these commands once to set up your workflow:

```bash
# 1. Create PROGRESS.md
touch PROGRESS.md

# 2. Copy session template
mkdir -p .claude
cp SESSION_TEMPLATE.md .claude/

# 3. Configure git for better commits
git config --global core.editor "code --wait"  # Or your preferred editor

# 4. Create commit message template (optional)
cat > .gitmessage << 'EOF'
# Summary (50 chars or less)

# Detailed explanation:
# - What was done
# - Why it was done
# - What's next

# Context for next session:
EOF

git config commit.template .gitmessage
```

---

## 📊 Measuring Success

You're doing it right if:

✅ Can resume work in < 5 minutes after restart
✅ Never lose more than 15-30 minutes of work
✅ Have clear context of what was done
✅ Know exactly what to do next
✅ Can explain recent changes to others

---

## 🎯 Best Practices Summary

1. **Commit every 15-30 minutes** with descriptive messages
2. **Keep PROGRESS.md updated** throughout the day
3. **Create session summaries** before closing
4. **Use descriptive commit messages** with context
5. **Set Windows active hours** to prevent interruptions
6. **Create documentation files** for complex work
7. **Use git branches** for experimental work
8. **Push to remote** regularly (if using GitHub/GitLab)

---

## ⚠️ Red Flags

If you notice these, you're at risk:

❌ Last commit was hours ago
❌ PROGRESS.md hasn't been updated today
❌ Working on complex refactoring without commits
❌ No documentation for what you're doing
❌ Can't remember what you did 30 minutes ago
❌ Windows update notification showing

**Action**: Stop and commit/document immediately!

---

## 🚀 Advanced: Automated Backups

### Auto-commit script (optional)
Create `.claude/auto-commit.sh`:

```bash
#!/bin/bash
# Auto-commit every 30 minutes

while true; do
  sleep 1800  # 30 minutes

  if [[ -n $(git status -s) ]]; then
    git add .
    git commit -m "Auto-backup: $(date)"
    echo "Auto-committed at $(date)"
  fi
done
```

Run in background:
```bash
bash .claude/auto-commit.sh &
```

### Git hooks (optional)
Auto-update PROGRESS.md timestamp on commit:

```bash
# .git/hooks/post-commit
#!/bin/bash
sed -i "s/Last Updated:.*/Last Updated: $(date +%Y-%m-%d %H:%M)/" PROGRESS.md
```

---

## 📚 Additional Resources

- Git commit message conventions: https://www.conventionalcommits.org/
- Windows Update settings: Settings → Windows Update → Advanced options
- Claude Code docs: https://docs.anthropic.com/claude-code

---

**Remember**: The best backup is the one you do consistently!

Commit often, document thoroughly, and you'll never lose significant work again.
