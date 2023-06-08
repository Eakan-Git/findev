A Site project using React, SCSS and MUI.

## Run Locally

Clone the project

Go to the project directory

```bash
  cd front-end
```

Install dependencies

```bash
  yarn
```

Start the server

```bash
  yarn dev
```

## Documentation

### Project Architecture

## Dependencies
- react, react-dom, react-router-dom
- typescript
- sass
- vite
- zustand
- mui
- nanoid
### React

```
src/
├── assets/
│   ├── images/
│   ├── fonts/
│   └── videos/
├── elements/
│   ├── button/
│   │   ├── button.html
│   │   ├── button.scss
│   │   └── button.js
│   ├── input/
│   │   ├── input.html
│   │   ├── input.scss
│   │   └── input.js
│   └── ...
├── page/
│   ├── home/
│   │   ├── HomePage.tsx
│   │   ├── homePage.module.scss
│   │   ├── homePage.module.scss.d.ts
│   │   └── components/
│   │       ├── Carousel/
│   │       │   ├── Carousel.tsx
│   │       │   ├── carousel.module.scss
│   │       │   └── carousel.module.scss.d.ts
│   │       ├── About/
│   │       └── ...
│   │
│   └── ...
├── template/
│   ├── HomeTemplate/
│   │   ├── HomeTemplate.tsx
│   │   ├── homeTemplate.module.scss
│   │   └── homeTemplate.module.scss.d.ts
│   └── ...
├── main.tsx
├── styles/
├── @types/
└── mocks/
```

- 1 component per file

- Use Separation of Concern if your component have too many logic

- Config or Data should be put in an immutable constant

- Avoid empty html tag, use self-closing tag if you need one

- Prefer named export over default export

- Each component should be put inside separate folder

- Each component folder should consist of index.ts and MyComponent.tsx

- Context Providers should be put inside providers folder

### Git

- Commit message should be in format: <subject>: JIRA-TICKET <message>
- Use imperative voice
- Branch should be in format: <feature/bugfix/release/refactor/hotfix>/JIRA-TICKET-what-the-branch-for

## Contributors
