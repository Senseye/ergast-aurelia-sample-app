
export var appRoutes = [
  { route: '', redirect: 'seasons' },
  {
    route: 'seasons',
    name: 'seasons',
    moduleId: 'seasons/seasons',
    title: 'Formula 1 Seasons',
    navbar: {
    }
  },
  {
    route: 'season/:year',
    activationStrategy: 'replace',
    name: 'season-races',
    moduleId: 'season-races/season-races',
    title: 'Race winners',
    navbar: {
      back: {
        route: 'seasons',
        title: 'Seasons'
      }
    }
  }
];
