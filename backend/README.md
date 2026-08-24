# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.


--- 
- [x]: POST route to scrape a single URL
  - [x]: take url in req
  - [x]: first save the item with status processing
  - [x]: try catch scrape url
  - [x]: scrape and save in db
  - [x]: status completed, otherwise save this item as fail in catch block
  - [x]: return failed or succesfull items in reponse,
  - [x]: retry if a url scrape has failed 

- [x]: GET route to retrieve scraped items from db
- [x]: DELETE route to remove a scraped item from db

- [ ]: USE AI-sdk to generate summaries and tags of scraped items
