#!/bin/bash

# Clean development files
cleanup_dev() {
    echo "Cleaning development files..."
    rm -rf .next
    rm -rf node_modules/.cache
    find . -name "*.log" -type f -delete
}

# Deep clean everything
cleanup_full() {
    echo "Performing full cleanup..."
    rm -rf node_modules
    rm -rf .next
    rm -rf .cache
    rm -f package-lock.json
    npm cache clean --force
    npm install
}

# Production optimization
optimize_prod() {
    echo "Optimizing for production..."
    npm install --production
    npm prune --production
}