#!/bin/bash
git add .

echo "Commit message: "
read commit

git commit -m "$commit"
git push origin master