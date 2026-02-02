# Work Session Checklist

Keep this open while coding to prevent data loss!

---

## ✅ Starting a Session

- [ ] Check Windows update status
- [ ] Set "Active hours" if needed
- [ ] Review `PROGRESS.md`
- [ ] Check `git status` and `git log`
- [ ] Review any recent documentation

---

## ✅ During Work (Every 15-30 min)

- [ ] Save all files
- [ ] Run `git add .`
- [ ] Commit with message: `git commit -m "Progress: [what you did]"`
- [ ] Update `PROGRESS.md` with current state

---

## ✅ Before Breaks (Even 5 min!)

- [ ] Commit any changes
- [ ] Update `PROGRESS.md`
  - Mark what's done
  - Note what's in progress
  - Write next steps
- [ ] Push to remote (if using GitHub)

---

## ✅ End of Session

- [ ] Final commit with summary
- [ ] Complete session summary:
  ```bash
  cp .claude/SESSION_TEMPLATE.md .claude/session-$(date +%Y-%m-%d).md
  ```
- [ ] Update `PROGRESS.md` with:
  - What was accomplished today
  - Current state
  - Next session plan
- [ ] Push all commits to remote
- [ ] Close files, shut down gracefully

---

## ✅ Emergency Checklist (Windows Update Warning!)

If Windows shows restart notification:

- [ ] **IMMEDIATELY**: `git add . && git commit -m "Emergency commit before restart"`
- [ ] **Quick update**: Add one line to `PROGRESS.md` with current state
- [ ] **Commit again**: `git commit -am "Update PROGRESS before restart"`
- [ ] **Push**: `git push` (if using remote)
- [ ] **Note**: Write down current task on paper if no time

---

## 🎯 One-Liner Quick Save

Keep this command handy:

```bash
# Ultimate quick save
git add . && git commit -m "Quick save: $(date)" && echo "Working on: [TASK]" >> PROGRESS.md && git commit -am "Update progress"
```

Or create an alias:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias quicksave='git add . && git commit -m "Quick save: $(date)"'

# Then just run:
quicksave
```

---

## 📊 Daily Review

At end of day:

- [ ] Review all commits: `git log --oneline --since="1 day ago"`
- [ ] Check `PROGRESS.md` is complete
- [ ] Ensure all work is committed
- [ ] Push to remote
- [ ] Leave clear notes for tomorrow

---

## 🚨 If Work Was Lost

Recovery steps:

1. Check git: `git log` - What was committed?
2. Check transcripts: `ls ~/.claude/projects/c--Users-scott-Desktop-SourdoughSuiteNew/*.jsonl`
3. Check `PROGRESS.md` - What was planned?
4. Check uncommitted: `git status` and `git diff`
5. Recreate from memory while fresh

---

**Print this out and keep it next to your laptop!**
