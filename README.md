# Foci.APP
Foci Assignment

Please follow these steps to run the front-end
- clone repository into a folder
- start API - by default for dev the API is located at http://localhost:5195/api; you can change that in environment.ts
- visit http://localhost:4200

For running the unit tests (there are unit tests added to todos.component and edit-todo.component)
- run npm run test

# Design considerations

- clear separation of functionality in components
- use services for business logic that are not view logic related (separation of concern)
- clear separation between models and service contracts
- use mappers between data types
- use centralized API access
- use observables and/or signals to communicate between components
- use smart component / dumb component architecture where applicable (not applied in this project)
- use async programming model where possible to avoid callbacks
- use routing, with proper resolvers and guards
- use state management like services or a store (like ngrx, but not applied here)
- use DI for concise coding and testability
- ensure proper cleanup on destroy (components and component-scoped services) - not applied here
- make experience robust by using centralized error handling, component-level error handling and input validation
- consider using cancellable API where applicable, for long operations (not applied here)

# Demo

You can find a demo instance of the App at http://foci-demo.azisoft.ca/app
