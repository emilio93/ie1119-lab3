#!/bin/bash

remote=${1:-origin}
branch=${2:-master}

if [ -z "$(git status --porcelain)" ]; then
  rm -rf docs
  mkdir docs
  cp -r webapp/* docs
  git branch ${branch} 2>/dev/null
  git checkout ${branch}
  git add docs
  git commit -m "[Auto]Update webapp contents."
  git push ${remote} ${branch}
else
  echo "Clean up git status before publishing the webapp!"
fi

