#!/bin/bash

# Sun Session Summarizer MCP - Publish Script

echo "🌞 Preparing Sun Session Summarizer MCP for publication..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean and build
echo "🧹 Cleaning previous build..."
npm run clean

echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -f "dist/server.js" ]; then
    echo "❌ Error: Build failed. dist/server.js not found."
    exit 1
fi

# Make server.js executable
chmod +x dist/server.js

echo "✅ Build completed successfully!"

# Check npm login status
echo "🔐 Checking npm login status..."
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ You are not logged in to npm. Please run 'npm login' first."
    exit 1
fi

echo "📦 Ready to publish!"
echo ""
echo "To publish to npm, run:"
echo "  npm publish"
echo ""
echo "After publishing, users can install with:"
echo "  npx sun-mcp@latest"
echo ""
echo "And configure in Claude Desktop as:"
echo "  Name: Sun MCP"
echo "  Command: npx -y sun-mcp@latest"
