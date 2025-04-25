<<<<<<< HEAD
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
=======
# Demonstrating Copilot's Codebase Search

## Effective Search Demonstrations

### 1. Search for Function Names
Try searching for these distinct function names:
- `toTitleCase`
- `isValidEmail`
- `memoize`
- `handleDatabaseError`
- `sortTasksByDueDate`
- `useDataFetching`

### 2. Search for API Routes and Endpoints
Try these API-related searches:
- `api/users/:id`
- `api/tasks`
- `POST /api/tasks`
- `fetch user data by ID`

### 3. Search for Code Patterns
Try searching for these implementation patterns:
- `reduce array group by`
- `sort by due date`
- `validate email regex`
- `cache Map memoize`
- `async function fetch data`
- `form submission preventDefault`

### 4. Search for UI Components
Try these React component searches:
- `TaskForm component`
- `User Profile section`
- `Loading state handling`
- `conditional rendering error`

### 5. Search for Data Structures
Try these data structure searches:
- `users object with IDs`
- `task with title and description`
- `toLocaleDateString format`

### 6. Cross-File Functionality
Try these searches that span multiple files:
- `task creation flow`
- `database error handling`
- `date formatting`

## Presentation Tips

1. **Natural Language Queries**: Show how Copilot understands natural language (e.g., "how do we validate emails?" instead of exact function names)

2. **Partial Matches**: Demonstrate searching with partial information (e.g., "format date" instead of exact function name)

3. **Implementation Discovery**: Show searching for "how is X implemented" to find code patterns

4. **Function vs Implementation**: Compare searching for function names versus searching for what the function does

5. **Cross-File Navigation**: Show how search helps understand code flows that span multiple files

6. **Progressive Refinement**: Start with a broad search and progressively narrow it down
>>>>>>> 8edf392 (seach in codebase)
