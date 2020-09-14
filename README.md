# Cruelty Free | NYC: compassionate alternatives


This application allows the user to create, review, update and delete human and animal cruelty free brands and service providers within the New York City metro area.  Cruelty Free | NYC is intended to spread awareness about the animal harm and civil injustices currently existing within various industries by providing users with compassionate alternative options.


## Important Links

- [Client Repository](https://github.com/HarlemHubLive/Cruelty-Free-NYC-client)
- [Deployed Client](https://harlemhublive.github.io/Cruelty-Free-NYC-client/)
- [Deployed API](https://damp-shore-14818.herokuapp.com/)


## Planning Story

The idea for Cruelty Free came to me as I Google searched 'cruelty free brands nyc' and had to visit various websites to find the information that I was looking for. I thought, why not create a one-stop hub of information where users can find compassionate brands within their area. I used this pitch to create the user stories, wireframes and ERD and ultimately bring the app to life!


### User Stories

Auth:
- As a user I want to sign up for an account or sign in to an existing account.
- As a signed in user I want to change my password or sign out of my account.
Cards:
- As a signed in user I want to create a new buisness card post.
- As a user I want to read multiple buisness cards.
- As a user I want to read a single buisness page.
- As a signed in user I want to update a buisness card I own.
- As a user I want to delete a buisness card I own.


### Technologies Used

- Express API
- MongoDB


### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/`    | `users#changepw`  |
| DELETE | `/sign-out/`           | `users#signout`   |

### Buisness Cards

| Verb   | URI Pattern            | Controller#Action    |
|--------|------------------------|----------------------|
| POST   | `/create`              | `cards#create`       |
| POST   | `/cards`               | `cards#show-all`     |
| POST   | `/cards/:category`     | `category#show-all`  |
| POST   | `/cards/:id`           | `card#show`          |
| PATCH  | `/cards/:id`           | `card#update`        |
| DELETE | `/cards/:id`           | `card#delete`        |


### Unsolved Problems

- Still need to ....
- Would like to eventually ....


## Images

#### ERD:
[ERD - built with Miro](https://miro.com/app/board/o9J_klBph-Q=/)
