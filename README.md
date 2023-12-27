⚠ This is just a quick application I built to drive some personal experiments. It is not intended to be used in any kind of production environment, and is not actively maintained.

# The Simplest Journaling App
I wanted to build just a quick, extremely minimal application for journaling in a way that was contextually vaccuous, for the sake of collecting genera/unstructured data for analysis and experimentation. It was important that the application was as simple as possible, didn't look exceptionally (read: distractingly) good or bad, allowed entry with minimal friction to allow continuous writing/editing while thoughts were fresh, stored data in a way that was interoperable with at least some other widely used format (in this case, TiddlyWiki), and was easily accessible from any device.

A key consideration here was that I needed to be able to write without the influence of additional posts to ensure that entries were honest and didn't fit any particular narrative (intentionally or unintentionally), to ensure that it is a solid fit for behavioral analysis and support.

# Usage
## Installation
To run without hot reloading:
1. Clone the repository
2. Install dependencies with `npm install`
3. Build the application with `npm run build`
4. Run the application with `npm start`

## Development
For development, the react scripts you'll want to use are `npm run dev:backend` and `npm run dev:fronted`, respectively. The backend will run the express server with nodemon, and the frontend will run the react scripts on a separate port with hot reloading.