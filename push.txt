#!/bin/bash

# Number of commits to generate
NUM_COMMITS=20

for ((i=0; i<$NUM_COMMITS; i++)); do
  # Random number of weeks and days ago
  weeks=$((RANDOM % 55))
  days=$((RANDOM % 7))

  # Calculate
  commit_date=$(date -d "$((365 - (weeks * 7 + days))) days ago" '+%Y-%m-%dT%H:%M:%S')

  # Create/update a dummy file
  echo "$commit_date" > data.txt

  # Stage and commit with custom date
  GIT_AUTHOR_DATE="$commit_date" GIT_COMMITTER_DATE="$commit_date" \
    git add data.txt && git commit -m "$commit_date"

  echo "Committed on $commit_date"
done

# Push all commits
git push