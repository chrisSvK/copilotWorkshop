# Legacy Library System

This is a demo project for GitHub Copilot presentation that showcases common "legacy code" issues that can be improved with modern JavaScript practices.

## Project Structure

- `librarySystem.js` - Main library system functionality
- `utils/database.js` - Database access layer with file-based persistence

## Legacy Code Issues

This project intentionally contains several legacy code issues:

1. **Callback Hell**: Deeply nested callbacks making the code hard to follow
2. **Global Variables**: Mutable global state
3. **Poor Naming**: Unclear function and variable names (e.g., `f1`)
4. **Monolithic Functions**: Functions that do too many things
5. **Lack of Error Handling**: Inconsistent or minimal error handling
6. **No Type Checking**: No TypeScript or JSDoc type annotations
7. **Poor Documentation**: Minimal or missing documentation
8. **No Tests**: No unit or integration tests

## Purpose

This project is designed to demonstrate how GitHub Copilot can help refactor and modernize legacy code.