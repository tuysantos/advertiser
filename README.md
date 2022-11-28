# Advertiser

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.12.

It is possible to add address and create Advertisers.

If the user tries to delete an address in used, an error will show.

## Frameworks

- Angular version 14.2.12
- Angular Material version 13.3.9
- TypeeScript version 4.6.2
- NgRx version 14.3.2
- RxJs version 7.5.0

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

Run `npm run build:all` to check the code for the best practice, run all unit tests and finally build the project.

## Prettier & Lint

Run `npm run prettier:check` to check the code for the best practice.

Run `npm run lint` to check the code for the best practice.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `npm run test:ci` to execute the unit tests without the browser.

Run `npm run test:only` to execute the unit tests with the report of code coverage.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Considerations

A - TODO
1 - AddressesService & AdvertiserService

Post method wasn't implemented because it was a restriction in this project. For the same reason I mocked the update and delete methods too.

B - Mock data

Both stores (Address and Advertiser) use sessionStorage to help storing the new data because the getAddresses & get Advertisers will always return the same data (regardless of any CRUD operation).

C - Test Coverage

In this project the 100% test coverage was not necessary due to the use of the mock methods in some service calls.

D - Running the unit test

There is a set of commands in the section (Running unit tests), to explain how to run the tests.

E - Intalling dependencies

Please run the command 'npm i'

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
