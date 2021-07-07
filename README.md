# Wall of Love
## API reference

### GET `{baseUrl}/wol/`
testing connection
### POST `{baseUrl}/wol/new`
- accepts an array of objects in the `data` field
- object form
- fetches data from the link (slack/twitter)
- uploads (url, author name, author image, text) to postgres
### GET `{baseUrl}/wol/raw`
- returns raw json of all testimonials
