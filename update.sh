#!/bin/bash

echo "Commit message: "
read commit
echo "Push changes with commit: \"$commit\"?"
echo "(y/n): "
read confirm

if [ "$confirm" == "y" ]; then
    git add .

    git commit -m "$commit"
    git push origin master
fi
